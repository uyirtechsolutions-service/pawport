import { NextResponse } from 'next/server'

// ─── Gupshup config ───────────────────────────────────────────────────────────
const API_KEY    = process.env.GUPSHUP_API_KEY || ''
const SOURCE     = process.env.GUPSHUP_SOURCE_NUMBER || ''   // e.g. 919087470137
const APP_NAME   = process.env.GUPSHUP_APP_NAME || ''        // e.g. pawporttransport
const TEMPLATE_ID = process.env.GUPSHUP_TEMPLATE_BUYER || '' // template UUID

// Send a Gupshup WhatsApp template message using form-urlencoded (exact doc format)
// Template params must be a plain string array: ["val1", "val2", ...]
async function sendWhatsApp(toNumber, params) {
  const destination = String(toNumber).replace(/\D/g, '')

  // Build template JSON exactly as Gupshup docs specify
  const templateJson = JSON.stringify({
    id: TEMPLATE_ID,
    params: params.map(p => String(p || 'N/A')),
  })

  // Build x-www-form-urlencoded body manually
  const formParts = [
    `channel=whatsapp`,
    `source=${encodeURIComponent(SOURCE)}`,
    `destination=${encodeURIComponent(destination)}`,
    `src.name=${encodeURIComponent(APP_NAME)}`,
    `template=${encodeURIComponent(templateJson)}`,
  ]
  const formBody = formParts.join('&')

  const response = await fetch('https://api.gupshup.io/wa/api/v1/template/msg', {
    method: 'POST',
    headers: {
      'apikey': API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  })

  const text = await response.text()

  // Log full response so we can debug from server logs
  console.log(`[Gupshup] → ${destination} | status=${response.status} | body=${text}`)

  if (!response.ok) {
    throw new Error(`Gupshup HTTP ${response.status}: ${text}`)
  }

  let json
  try { json = JSON.parse(text) } catch { json = { raw: text } }

  if (json?.status === 'error') {
    throw new Error(`Gupshup error: ${json.message || text}`)
  }

  return json
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json()

    const {
      buyerName, buyerWhatsapp, petName, petType, petBreed,
      petAge, petWeight, petDetails, pickupPlace, dropoffPlace,
      bookingDate, preferredTime, transportMode,
    } = body

    if (!buyerWhatsapp) {
      return NextResponse.json({ message: 'WhatsApp number is required' }, { status: 400 })
    }

    if (!TEMPLATE_ID) {
      return NextResponse.json({ message: 'Template ID not configured' }, { status: 500 })
    }

    // 13 params — must match template variable order exactly:
    // {{1}} Customer Name  {{2}} WhatsApp  {{3}} Pet Name   {{4}} Pet Type
    // {{5}} Breed          {{6}} Age        {{7}} Weight     {{8}} Notes
    // {{9}} Pickup         {{10}} Drop      {{11}} Date      {{12}} Time Slot
    // {{13}} Transport Mode
    const params = [
      buyerName, buyerWhatsapp, petName, petType, petBreed,
      petAge, petWeight, petDetails, pickupPlace, dropoffPlace,
      bookingDate, preferredTime, transportMode,
    ]

    let status = 'failed'
    let error = null

    try {
      await sendWhatsApp(buyerWhatsapp, params)
      status = 'sent'
    } catch (err) {
      error = err.message
      console.error('[Orders] Send failed:', err.message)
    }

    return NextResponse.json({ message: 'Booking processed', status, error })

  } catch (err) {
    console.error('[Orders] Unexpected error:', err.message)
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 })
  }
}
