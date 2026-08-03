import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import path from 'path'

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
const GUPSHUP_TPL_TRANSPORTER = process.env.GUPSHUP_TEMPLATE_TRANSPORTER || ''
const GUPSHUP_TPL_BUYER = process.env.GUPSHUP_TEMPLATE_BUYER || ''
const TRANSPORTER_WHATSAPP = '919087470137'

async function getPublicUrl(file) {
  const ext = path.extname(file.name || '.jpg').toLowerCase()
  const fileName = `pet-photos/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from('pet-images')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) throw new Error(`Image upload failed: ${error.message}`)

  const { data } = supabase.storage.from('pet-images').getPublicUrl(fileName)
  return { url: data.publicUrl, path: fileName }
}

async function deleteImage(filePath) {
  try {
    await supabase.storage.from('pet-images').remove([filePath])
  } catch (e) {
    console.warn('Image cleanup warning:', e.message)
  }
}

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

export async function POST(request) {
  try {
    const formData = await request.formData()

    const buyerName = formData.get('buyerName')
    const buyerWhatsapp = formData.get('buyerWhatsapp')
    const petName = formData.get('petName')
    const petType = formData.get('petType')
    const petBreed = formData.get('petBreed')
    const petAge = formData.get('petAge')
    const petWeight = formData.get('petWeight')
    const petDetails = formData.get('petDetails')
    const pickupPlace = formData.get('pickupPlace')
    const dropoffPlace = formData.get('dropoffPlace')
    const bookingDate = formData.get('bookingDate')
    const preferredTime = formData.get('preferredTime')
    const transportMode = formData.get('transportMode')
    const petImage = formData.get('petImage')

    if (!buyerWhatsapp) {
      return NextResponse.json({ message: 'Buyer WhatsApp number is required' }, { status: 400 })
    }

    // Upload pet image temporarily to get public URL
    let imageUrl = null
    let imageFilePath = null
    if (petImage && petImage.size > 0) {
      try {
        const result = await getPublicUrl(petImage)
        imageUrl = result.url
        imageFilePath = result.path
      } catch (e) {
        console.error('Image upload failed:', e.message)
      }
    }

    const results = { transporter: null, buyer: null }

    // 1. Send to TRANSPORTER
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

    // 2. Send to BUYER
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

    return NextResponse.json({
      message: 'Booking sent',
      transporter: results.transporter ? 'sent' : 'skipped',
      buyer: results.buyer ? 'sent' : 'skipped',
    })
  } catch (error) {
    console.error('Order failed:', error.message)
    return NextResponse.json({ message: error.message || 'Failed to send booking' }, { status: 500 })
  }
}