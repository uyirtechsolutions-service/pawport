import { NextResponse } from 'next/server'

// Debug endpoint — check env vars and optionally fire a test WhatsApp message
// GET  /api/debug-env          → show env status
// POST /api/debug-env          → send a test WhatsApp to the number in body { "to": "91XXXXXXXXXX" }

export async function GET() {
  return NextResponse.json({
    GUPSHUP_API_KEY:       process.env.GUPSHUP_API_KEY       ? '✓ set' : '✗ MISSING',
    GUPSHUP_SOURCE_NUMBER: process.env.GUPSHUP_SOURCE_NUMBER || '✗ MISSING',
    GUPSHUP_APP_NAME:      process.env.GUPSHUP_APP_NAME      || '✗ MISSING',
    GUPSHUP_TEMPLATE_BUYER:process.env.GUPSHUP_TEMPLATE_BUYER|| '✗ MISSING',
    SUPABASE_URL:          process.env.SUPABASE_URL           ? '✓ set' : '✗ MISSING',
    SUPABASE_SERVICE_KEY:  process.env.SUPABASE_SERVICE_KEY   ? '✓ set' : '✗ MISSING',
    NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL      ? '✓ set' : '✗ MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ set' : '✗ MISSING',
  })
}

export async function POST(request) {
  try {
    const { to } = await request.json()
    if (!to) return NextResponse.json({ error: 'Provide { "to": "91XXXXXXXXXX" }' }, { status: 400 })

    const API_KEY     = process.env.GUPSHUP_API_KEY || ''
    const SOURCE      = process.env.GUPSHUP_SOURCE_NUMBER || ''
    const APP_NAME    = process.env.GUPSHUP_APP_NAME || ''
    const TEMPLATE_ID = process.env.GUPSHUP_TEMPLATE_BUYER || ''

    const destination = String(to).replace(/\D/g, '')

    // Use dummy values for all 13 params
    const params = [
      'Test Customer', destination, 'Buddy', 'Dog', 'Labrador',
      '2 years', '15 kg', 'Friendly dog', 'Chennai', 'Bangalore',
      '2026-08-10', 'Morning (9 AM – 12 PM)', 'Ground Transport',
    ]

    const templateJson = JSON.stringify({ id: TEMPLATE_ID, params })
    const formBody = [
      `channel=whatsapp`,
      `source=${encodeURIComponent(SOURCE)}`,
      `destination=${encodeURIComponent(destination)}`,
      `src.name=${encodeURIComponent(APP_NAME)}`,
      `template=${encodeURIComponent(templateJson)}`,
    ].join('&')

    const res = await fetch('https://api.gupshup.io/wa/api/v1/template/msg', {
      method: 'POST',
      headers: { apikey: API_KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    })

    const raw = await res.text()
    let parsed
    try { parsed = JSON.parse(raw) } catch { parsed = raw }

    return NextResponse.json({
      httpStatus: res.status,
      gupshupResponse: parsed,
      sentTo: destination,
      templateId: TEMPLATE_ID,
      source: SOURCE,
      appName: APP_NAME,
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
