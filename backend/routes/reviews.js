const express = require('express')
const supabase = require('../config/database')

const router = express.Router()

// GET /api/reviews — fetch all approved reviews (public)
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data)
  } catch (error) {
    next(error)
  }
})

// POST /api/reviews — submit a new review (public, no auth required)
router.post('/', async (req, res, next) => {
  try {
    const { customer_name, rating, comment } = req.body

    if (!customer_name || !rating || !comment) {
      return res.status(400).json({ message: 'Customer name, rating, and comment are required.' })
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' })
    }

    const review = {
      customer_name,
      rating,
      comment,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router