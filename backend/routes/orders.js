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

// Supabase — storage only for temporary public URL
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

// Gupshup config
const GUPSHUP_API = 'https://api.gupshup.io/wa/api/v1/template/msg'
const GUPSHUP_API_KEY = process.env.GUPSHUP_API_KEY || ''
const GUPSHUP_SOURCE = process.env.GUPSHUP_SOURCE_NUMBER || ''
const GUPSHUP_APP = process.env.GUPSHUP_APP_NAME || ''
const GUPSHUP_TPL_TRANSPORTER = process.env.GUPSHUP_TEMPLATE_TRANSPORTER || '' // template with image header + 13 params
const GUPSHUP_TPL_BUYER = process.env.GUPSHUP_TEMPLATE_BUYER || ''             // template text-only + 7 params
const TRANSPORTER_WHATSAPP = '919087470137'

// Upload image to Supabase Storage temporarily (just to get public URL for Gupshup)
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

  const { data } = supabase.storage.from('pet-images').getPublicUrl(fileName)
  return { url: data.publicUrl, path: fileName }
}

// Delete image from Supabase Storage after sending
async function deleteImage(filePath) {
  try {
    await supabase.storage.from('pet-images').remove([filePath])
  } catch (e) {
    console.warn('Image cleanup warning:', e.message)
  }
}

// Send a Gupshup WhatsApp message
async function sendGupshup(destination, templateId, params, imageUrl) {
  const cleanNumber = destination.replace(/[^0-9]/g, '')
  const template = { id: templateId, params }
  const body = new URLSearchParams()
  body.append('channel', 'whatsapp')
  body.append('source', GUPSHUP_SOURCE)
  body.append('destination', cleanNumber)
  body.append('src.name', GUPSHUP_APP)
  body.append('template', JSON.stringify(template))

  if (imageUrl) {
    body.append('message', JSON.stringify({
      type: 'image',
      originalUrl: imageUrl,
      previewUrl: imageUrl,
    }))
  }

  const response = await axios.post(GUPSHUP_API, body.toString(), {
    headers: {
      'apikey': GUPSHUP_API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  return response.data
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

    // Delete image from Supabase immediately
    if (imageFilePath) {
      deleteImage(imageFilePath)
    }

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