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

export async function GET(request) {
  try {
    const auth = authenticate(request)
    if (auth.error) {
      return NextResponse.json({ message: 'No token provided, authorization denied.' }, { status: 401 })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', auth.user.id)
      .single()

    if (error || !user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}