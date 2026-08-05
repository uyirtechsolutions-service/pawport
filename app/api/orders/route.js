import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

// Supabase config (service role — for DB writes only, image upload now happens client-side)
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Gupshup config
const GUPSHUP_API = 'https://api.gupshup.io/wa/api/v1/template/msg'
const GUPSHUP_MSG_API = 'https://api.gupshup.io/wa/api/v1/msg'
const GUPSHUP_API_KEY = process.env.GUPSHUP_API_KEY || ''
const GUPSHUP_SOURCE = process.env.GUPSHUP_SOURCE_NUMBER || ''
const GUPSHUP_APP = process.env.GUPSHUP_APP_NAME || ''
const GUPSHUP_TPL_TRANSPORTER = process.env.GUPSHUP_TEMPLATE_TRANSPORTER || ''
const GUPSHUP_TPL_BUYER = process.env.GUPSHUP_TEMPLATE_BUYER || ''
const TRANSPORTER_WHATSAPP = '919087470137'

// Fallback image — used when user didn't upload a photo
// Must be a direct public URL ending in .jpg/.png
const FALLBACK_IMAGE_URL = process.env.FALLBACK_PET_IMAGE_URL || 'https://cdn-icons-png.flaticon.com/512/616/616408.png'

async function saveImageUrlToDb(imageUrl, storagePath, buyerWhatsapp) {
  try {
    const { data, error } = await supabase
      .from('pet_images')
      .insert({
        image_url: imageUrl,
        storage_path: storagePath,
        buyer_whatsapp: buyerWhatsapp,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('DB insert error:', error)
      return false
    }

    console.log('Image URL saved to DB:', data[0]?.id)
    return true
  } catch (e) {
    console.error('DB insert exception:', e.message)
    return false
  }
}

async function clearOldImageUrlsFromDb() {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    await supabase
      .from('pet_images')
      .update({ cleared_at: new Date().toISOString() })
      .is('cleared_at', null)
      .lt('created_at', thirtyDaysAgo.toISOString())
  } catch (e) {
    console.warn('Cleanup error:', e.message)
  }
}

async function sendGupshup(destination, templateId, params, imageUrl) {
  const cleanNumber = destination.replace(/[^0-9]/g, '')

  const fields = [
    ['channel', 'whatsapp'],
    ['source', GUPSHUP_SOURCE],
    ['destination', cleanNumber],
    ['src.name', GUPSHUP_APP],
    ['template', JSON.stringify({ id: templateId, params: params.map(p => String(p)) })],
  ]

  if (imageUrl) {
    fields.push(['message', JSON.stringify({
      type: 'image',
      image: { link: imageUrl },
    })])
  }

  const body = fields
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')

  console.log('Gupshup sending to:', cleanNumber, '| image:', imageUrl || '(none)')

  try {
    const response = await axios.post(GUPSHUP_API, body, {
      headers: {
        'apikey': GUPSHUP_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  } catch (err) {
    // If image caused the rejection, retry without image so message still goes through
    if (imageUrl && err.response?.status === 400) {
      console.warn('Image rejected by Gupshup — retrying without image for:', cleanNumber)
      const fallbackFields = fields.filter(([k]) => k !== 'message')
      const fallbackBody = fallbackFields
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
      try {
        const retryResponse = await axios.post(GUPSHUP_API, fallbackBody, {
          headers: {
            'apikey': GUPSHUP_API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        console.log('Retry without image succeeded for:', cleanNumber)
        return retryResponse.data
      } catch (retryErr) {
        const retryDetail = retryErr.response?.data ? JSON.stringify(retryErr.response.data) : retryErr.message
        throw new Error(`Gupshup error (${retryErr.response?.status}): ${retryDetail}`)
      }
    }
    const detail = err.response?.data ? JSON.stringify(err.response.data) : err.message
    throw new Error(`Gupshup error (${err.response?.status}): ${detail}`)
  }
}

// Send a plain image message (not a template) — used to follow up the booking text with the pet photo
async function sendImageMessage(destination, imageUrl, caption) {
  const cleanNumber = destination.replace(/[^0-9]/g, '')

  const fields = [
    ['channel', 'whatsapp'],
    ['source', GUPSHUP_SOURCE],
    ['destination', cleanNumber],
    ['src.name', GUPSHUP_APP],
    ['message', JSON.stringify({
      type: 'image',
      originalUrl: imageUrl,
      previewUrl: imageUrl,
      caption: caption || 'Pet Photo',
    })],
  ]

  const body = fields
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')

  const response = await axios.post(GUPSHUP_MSG_API, body, {
    headers: {
      'apikey': GUPSHUP_API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  return response.data
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      buyerName, buyerWhatsapp, petName, petType, petBreed,
      petAge, petWeight, petDetails, pickupPlace, dropoffPlace,
      bookingDate, preferredTime, transportMode,
      petImageUrl,  // plain public URL uploaded by client directly to Supabase
    } = body

    if (!buyerWhatsapp) {
      return NextResponse.json({ message: 'Buyer WhatsApp number is required' }, { status: 400 })
    }

    // Save image URL to DB (image was already uploaded client-side)
    if (petImageUrl) {
      const storagePath = petImageUrl.split('/pet-images/')[1] || petImageUrl
      await saveImageUrlToDb(petImageUrl, storagePath, buyerWhatsapp)
    }

    // Transporter template always needs an image — use fallback if none uploaded
    const transporterImageUrl = petImageUrl || FALLBACK_IMAGE_URL
    console.log('Transporter image URL:', transporterImageUrl)

    // Send WhatsApp messages
    const results = { transporter: null, buyer: null }

    if (GUPSHUP_TPL_TRANSPORTER) {
      try {
        // Step 1: send booking details as text template
        results.transporter = await sendGupshup(
          TRANSPORTER_WHATSAPP,
          GUPSHUP_TPL_TRANSPORTER,
          [buyerName, buyerWhatsapp, petName, petType, petBreed, petAge, petWeight, petDetails, pickupPlace, dropoffPlace, bookingDate, preferredTime, transportMode].map(v => v || 'N/A'),
          null  // no image in template — sent separately below
        )
        // Step 2: send pet photo as a follow-up plain image message
        if (transporterImageUrl) {
          try {
            await sendImageMessage(
              TRANSPORTER_WHATSAPP,
              transporterImageUrl,
              `Pet photo for ${petName || petType} (${buyerName})`
            )
            console.log('Pet photo sent to transporter')
          } catch (imgErr) {
            console.warn('Pet photo follow-up failed:', imgErr.message)
          }
        }
      } catch (e) {
        console.error('Transporter message failed:', e.message)
        results.transporter = 'failed'
      }
    }

    if (GUPSHUP_TPL_BUYER) {
      try {
        results.buyer = await sendGupshup(
          buyerWhatsapp,
          GUPSHUP_TPL_BUYER,
          [buyerName, petName || petType, pickupPlace, dropoffPlace, bookingDate, preferredTime, transportMode].map(v => v || 'N/A'),
          null
        )
      } catch (e) {
        console.error('Buyer message failed:', e.message)
        results.buyer = 'failed'
      }
    }

    await clearOldImageUrlsFromDb()

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
