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

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Gupshup config
const GUPSHUP_API     = 'https://api.gupshup.io/wa/api/v1/template/msg'
const GUPSHUP_API_KEY = process.env.GUPSHUP_API_KEY || ''
const GUPSHUP_SOURCE  = process.env.GUPSHUP_SOURCE_NUMBER || ''
const GUPSHUP_APP     = process.env.GUPSHUP_APP_NAME || ''
const GUPSHUP_TPL_BUYER = process.env.GUPSHUP_TEMPLATE_BUYER || ''

// Upload image to Supabase Storage and return a 30-day signed URL
async function getPublicUrl(file) {
  const ext = path.extname(file.originalname).toLowerCase()
  const fileName = `pet-photos/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

  const { error } = await supabase.storage
    .from('pet-images')
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false })

  if (error) throw new Error(`Image upload failed: ${error.message}`)

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from('pet-images')
    .createSignedUrl(fileName, 60 * 60 * 24 * 30)

  if (signedUrlError) {
    console.warn('Signed URL creation failed, falling back to public URL:', signedUrlError.message)
    const { data } = supabase.storage.from('pet-images').getPublicUrl(fileName)
    return { url: data.publicUrl, path: fileName }
  }

  return { url: signedUrlData.signedUrl, path: fileName }
}

async function saveImageUrlToDb(imageUrl, storagePath, buyerWhatsapp) {
  try {
    const response = await axios.post(
      `${SUPABASE_URL}/rest/v1/pet_images`,
      { image_url: imageUrl, storage_path: storagePath, buyer_whatsapp: buyerWhatsapp, created_at: new Date().toISOString() },
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
      }
    )
    return { success: true, data: response.data }
  } catch (e) {
    console.error('Error saving image URL to DB:', e.message)
    return { success: false, error: e.message }
  }
}

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
    if (error) console.warn('Failed to clear old image URLs:', error.message)
    else if (data?.length > 0) console.log(`Cleared ${data.length} old image URL(s) from DB`)
  } catch (e) {
    console.warn('Cleanup error:', e.message)
  }
}

// Send a Gupshup WhatsApp template message
async function sendGupshup(destination, templateId, params) {
  const cleanNumber = destination.replace(/[^0-9]/g, '')
  const payload = {
    channel: 'whatsapp',
    source: GUPSHUP_SOURCE,
    destination: cleanNumber,
    'src.name': GUPSHUP_APP,
    template: { id: templateId, params: { body: params.map(p => String(p)) } },
  }

  try {
    const response = await axios.post(GUPSHUP_API, payload, {
      headers: { apikey: GUPSHUP_API_KEY, 'Content-Type': 'application/json' },
    })
    return response.data
  } catch (error) {
    const detail = JSON.stringify(error.response?.data || error.message)
    throw new Error(`Gupshup API error: ${error.response?.status} - ${detail}`)
  }
}

// POST /api/orders
// Sends the new 13-param buyer booking notification via Gupshup template:
// {{1}} Customer Name  {{2}} WhatsApp  {{3}} Pet Name  {{4}} Pet Type
// {{5}} Breed  {{6}} Age  {{7}} Weight  {{8}} Notes
// {{9}} Pickup  {{10}} Drop  {{11}} Date  {{12}} Time Slot  {{13}} Transport Mode
router.post('/', upload.single('petImage'), async (req, res) => {
  try {
    const {
      buyerName, buyerWhatsapp, petName, petType, petBreed,
      petAge, petWeight, petDetails, pickupPlace, dropoffPlace,
      bookingDate, preferredTime, transportMode,
    } = req.body

    if (!buyerWhatsapp) {
      return res.status(400).json({ message: 'Buyer WhatsApp number is required' })
    }

    // Upload pet image if provided
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

    const buyerParams = [
      buyerName, buyerWhatsapp, petName, petType, petBreed,
      petAge, petWeight, petDetails, pickupPlace, dropoffPlace,
      bookingDate, preferredTime, transportMode,
    ].map(v => v || 'N/A')

    let buyer = 'skipped'
    let buyerError = null

    if (GUPSHUP_TPL_BUYER) {
      try {
        await sendGupshup(buyerWhatsapp, GUPSHUP_TPL_BUYER, buyerParams)
        buyer = 'sent'
      } catch (e) {
        buyerError = e.message
        console.error('Buyer message failed:', buyerError)
      }
    }

    // Persist image URL and clean up old records
    if (imageUrl && imageFilePath) {
      await saveImageUrlToDb(imageUrl, imageFilePath, buyerWhatsapp)
    }
    await clearOldImageUrlsFromDb()

    res.status(200).json({ message: 'Booking sent', buyer, buyerError })
  } catch (error) {
    console.error('Order failed:', error.message)
    res.status(500).json({ message: error.message || 'Failed to send booking' })
  }
})

module.exports = router
