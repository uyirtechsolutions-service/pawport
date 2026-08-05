import { NextResponse } from 'next/server'

// TEMPORARY debug endpoint — DELETE after fixing production
// Visit https://www.pawporttransport.in/api/debug-env to check env vars
export async function GET() {
  return NextResponse.json({
    SUPABASE_URL: process.env.SUPABASE_URL ? '✓ set' : '✗ MISSING',
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? '✓ set' : '✗ MISSING',
    GUPSHUP_API_KEY: process.env.GUPSHUP_API_KEY ? '✓ set' : '✗ MISSING',
    GUPSHUP_SOURCE_NUMBER: process.env.GUPSHUP_SOURCE_NUMBER || '✗ MISSING',
    GUPSHUP_APP_NAME: process.env.GUPSHUP_APP_NAME || '✗ MISSING',
    GUPSHUP_TEMPLATE_TRANSPORTER: process.env.GUPSHUP_TEMPLATE_TRANSPORTER || '✗ MISSING',
    GUPSHUP_TEMPLATE_BUYER: process.env.GUPSHUP_TEMPLATE_BUYER || '✗ MISSING',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ set' : '✗ MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ set' : '✗ MISSING',
  })
}
