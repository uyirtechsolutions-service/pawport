import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

const JWT_SECRET = process.env.JWT_SECRET || 'pawport-secret-key-change-in-production'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key'
)

function authenticate(req) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided' }
  }
  const token = authHeader.split(' ')[1]
  try {
    return { user: jwt.verify(token, JWT_SECRET) }
  } catch {
    return { error: 'Invalid token' }
  }
}

export async function POST(request) {
  try {
    const auth = authenticate(request)
    if (auth.error) {
      return NextResponse.json({ message: 'No token provided, authorization denied.' }, { status: 401 })
    }

    const { petCategory, bookingDate, userEmail, userName, pickupPlace, dropoffPlace, preferredTime, petName, notes } = await request.json()

    const booking = {
      user_id: auth.user.id,
      pet_category: petCategory,
      booking_date: bookingDate,
      user_email: userEmail,
      user_name: userName,
      pickup_place: pickupPlace,
      dropoff_place: dropoffPlace,
      preferred_time: preferredTime,
      pet_name: petName,
      notes,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const auth = authenticate(request)
    if (auth.error) {
      return NextResponse.json({ message: 'No token provided, authorization denied.' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 })
  }
}