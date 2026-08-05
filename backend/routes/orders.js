const express = require('express')
const multer = require('multer')
const axios = require('axios')
const { createClient } = require('@supabase/supabase-js')
const path = require('path')

const router = express.Router()

// Multer — memory storage, 5MB limit, images only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/
    const ext = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    if (ext && mime) return cb(null, true)
    cb(new Error('Only image files are allowed'))
  },
})

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''

// Supabase client for storage operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Gupshup config
const GUPSHUP_API = 'https://api.gupshup.io/wa/api/v1/template/msg'
const GUPSHUP_API_KEY = process.env.GUPSHUP_API_KEY || ''
const GUPSHUP_SOURCE = process.env.GUPSHUP_SOURCE_NUMBER || ''
const GUPSHUP_APP = process.env.GUPSHUP_APP_NAME || ''
const GUPSHUP_TPL_TRANSPORTER = process.env.GUPSHUP_TEMPLATE_TRANSPORTER || '' // template with image header + 13 params
const GUPSHUP_TPL_BUYER = process.env.GUPSHUP_TEMPLATE_BUYER || ''             // template text-only + 7 params
const TRANSPORTER_WHATSAPP = '919087470137'

// Upload image to Supabase Storage and get signed URL (works with private buckets)
async function getPublicUrl(file) {
  const ext = path.extname(file.originalname).toLowerCase()
  const fileName = `pet-photos/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

  const { error } = await supabase.storage
    .from('pet-images')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    })

  if (error) throw new Error(`Image upload failed: ${error.message}`)

  // Create a signed URL valid for 30 days (works with private buckets)
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('pet-images')
    .createSignedUrl(fileName, 60 * 60 * 24 * 30) // 30 days in seconds

  if (signedUrlError) {
    console.warn('Signed URL creation failed, falling back to public URL:', signedUrlError.message)
    // Fallback to public URL if signed URL fails
    const { data } = supabase.storage.from('pet-images').getPublicUrl(fileName)
    return { url: data.publicUrl, path: fileName }
  }

  return { url: signedUrlData.signedUrl, path: fileName }
}

// Save image URL to database using direct REST API call (more reliable)
async function saveImageUrlToDb(imageUrl, storagePath, buyerWhatsapp) {
  console.log('Attempting to save image URL to DB:', { 
    imageUrl: imageUrl?.substring(0, 50) + '...', 
    storagePath, 
    buyerWhatsapp,
    supabaseUrl: SUPABASE_URL 
  })
  
  try {
    // Use direct REST API call to Supabase
    const response = await axios.post(
      `${SUPABASE_URL}/rest/v1/pet_images`,
      {
        image_url: imageUrl,
        storage_path: storagePath,
        buyer_whatsapp: buyerWhatsapp,
        created_at: new Date().toISOString()
      },
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      }
    )
    
    console.log('Image URL saved to DB successfully via REST API:', response.data)
    return { success: true, data: response.data }
  } catch (e) {
    console.error('Error saving image URL to DB via REST API:', {
      message: e.message,
      status: e.response?.status,
      statusText: e.response?.statusText,
      data: e.response?.data,
      requestData: {
        image_url: imageUrl,
        storage_path: storagePath,
        buyer_whatsapp: buyerWhatsapp
      }
    })
    return { success: false, error: e.message, details: e.response?.data }
  }
}

// Clear image URLs from database after 30 days (but keep images in storage)
async function clearOldImageUrlsFromDb() {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data, error } = await supabase
      .from('pet_images')
      .update({ cleared_at: new Date().toISOString() })
      .is('cleared_at', null)
      .lt('created_at', thirtyDaysAgo.toISOString())
      .select('id')
    
    if (error) {
      console.warn('Failed to clear old image URLs from DB:', error.message)
    } else if (data && data.length > 0) {
      console.log(`Cleared ${data.length} old image URLs from DB (images remain in storage)`)
    }
  } catch (e) {
    console.warn('Error clearing old image URLs from DB:', e.message)
  }
}

// Send a Gupshup WhatsApp message
async function sendGupshup(destination, templateId, params, imageUrl) {
  const cleanNumber = destination.replace(/[^0-9]/g, '')
  
  // Build template params according to Gupshup WhatsApp Template API v1 format
  // Body params as simple array of strings
  const templateParams = {
    body: params.map(p => String(p))
  }
  
  // If there's an image (for transporter template with image header)
  if (imageUrl) {
    templateParams.header = [{ type: 'image', url: imageUrl }]
  }
  
  const template = { 
    id: templateId, 
    params: templateParams
  }
  
  // Build request payload
  const payload = {
    channel: 'whatsapp',
    source: GUPSHUP_SOURCE,
    destination: cleanNumber,
    'src.name': GUPSHUP_APP,
    template: template
  }

  try {
    const response = await axios.post(GUPSHUP_API, payload, {
      headers: {
        'apikey': GUPSHUP_API_KEY,
        'Content-Type': 'application/json',
      },
    })

    return response.data
  } catch (error) {
    // Capture full error details from Gupshup API
    const errorDetails = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      requestPayload: JSON.stringify(payload, null, 2),
    }
    console.error('Gupshup API error details:', JSON.stringify(errorDetails, null, 2))
    throw new Error(`Gupshup API error: ${error.response?.status} - ${JSON.stringify(error.response?.data || error.message)}`)
  }
}

// POST /api/orders — relay form data + pet image to transporter AND buyer via Gupshup WhatsApp
router.post('/', upload.single('petImage'), async (req, res) => {
  try {
    const {
      buyerName,
      buyerWhatsapp,
      petName,
      petType,
      petBreed,
      petAge,
      petWeight,
      petDetails,
      pickupPlace,
      dropoffPlace,
      bookingDate,
      preferredTime,
      transportMode,
    } = req.body

    if (!buyerWhatsapp) {
      return res.status(400).json({ message: 'Buyer WhatsApp number is required' })
    }

    // Upload pet image temporarily to get public URL
    let imageUrl = null
    let imageFilePath = null
    if (req.file) {
      try {
        const result = await getPublicUrl(req.file)
        imageUrl = result.url
        imageFilePath = result.path
      } catch (e) {
        console.error('Image upload failed:', e.message)
      }
    }

    const results = { transporter: null, buyer: null }

    // 1. Send to TRANSPORTER — full details + pet image
    if (GUPSHUP_TPL_TRANSPORTER) {
      const transporterParams = [
        buyerName || 'N/A',
        buyerWhatsapp,
        petName || 'N/A',
        petType || 'N/A',
        petBreed || 'N/A',
        petAge || 'N/A',
        petWeight || 'N/A',
        petDetails || 'N/A',
        pickupPlace || 'N/A',
        dropoffPlace || 'N/A',
        bookingDate || 'N/A',
        preferredTime || 'N/A',
        transportMode || 'N/A',
      ]
      try {
        results.transporter = await sendGupshup(TRANSPORTER_WHATSAPP, GUPSHUP_TPL_TRANSPORTER, transporterParams, imageUrl)
      } catch (e) {
        console.error('Transporter message failed:', e.message)
      }
    }

    // 2. Send to BUYER — confirmation with summary
    if (GUPSHUP_TPL_BUYER) {
      const buyerParams = [
        buyerName || 'there',
        petName || petType || 'your pet',
        pickupPlace || 'N/A',
        dropoffPlace || 'N/A',
        bookingDate || 'N/A',
        preferredTime || 'N/A',
        transportMode || 'N/A',
      ]
      try {
        results.buyer = await sendGupshup(buyerWhatsapp, GUPSHUP_TPL_BUYER, buyerParams, null)
      } catch (e) {
        console.error('Buyer message failed:', e.message)
      }
    }

    // Save image URL to database (don't delete from storage)
    // Image will remain in Supabase storage, URL will be cleared from DB after 30 days
    if (imageUrl && imageFilePath) {
      await saveImageUrlToDb(imageUrl, imageFilePath, buyerWhatsapp)
    }
    
    // Run cleanup of old image URLs from DB (30+ days old)
    // This only clears the DB records, images remain in storage
    await clearOldImageUrlsFromDb()

    res.status(200).json({
      message: 'Booking sent',
      transporter: results.transporter ? 'sent' : 'skipped',
      buyer: results.buyer ? 'sent' : 'skipped',
    })

  } catch (error) {
    console.error('Order failed:', error.message)
    res.status(500).json({ message: error.message || 'Failed to send booking' })
  }
})

module.exports = router