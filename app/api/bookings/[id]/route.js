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

export async function GET(request, { params }) {
  try {
    const auth = authenticate(request)
    if (auth.error) {
      return NextResponse.json({ message: 'No token provided, authorization denied.' }, { status: 401 })
    }

    const { id } = await params
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ message: 'Booking not found.' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get booking error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = authenticate(request)
    if (auth.error) {
      return NextResponse.json({ message: 'No token provided, authorization denied.' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabase
      .from('bookings')
      .update(body)
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ message: 'Booking not found.' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = authenticate(request)
    if (auth.error) {
      return NextResponse.json({ message: 'No token provided, authorization denied.' }, { status: 401 })
    }

    const { id } = await params
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
      .eq('user_id', auth.user.id)

    if (error) throw error

    return NextResponse.json({ message: 'Booking deleted.' })
  } catch (error) {
    console.error('Delete booking error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}