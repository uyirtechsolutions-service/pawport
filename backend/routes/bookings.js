const express = require('express')
const supabase = require('../config/database')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

// All booking routes require authentication
router.use(authenticate)

// POST /api/bookings
router.post('/', async (req, res, next) => {
  try {
    const { petCategory, bookingDate, userEmail, userName, pickupPlace, dropoffPlace, preferredTime, petName, notes } = req.body

    const booking = {
      user_id: req.user.id,
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

    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
})

// GET /api/bookings
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (error) {
    next(error)
  }
})

// GET /api/bookings/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single()

    if (error || !data) {
      return res.status(404).json({ message: 'Booking not found.' })
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
})

// PUT /api/bookings/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single()

    if (error || !data) {
      return res.status(404).json({ message: 'Booking not found.' })
    }

    res.json(data)
  } catch (error) {
    next(error)
  }
})

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)

    if (error) throw error

    res.json({ message: 'Booking deleted.' })
  } catch (error) {
    next(error)
  }
})

module.exports = router