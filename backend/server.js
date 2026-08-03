const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const authRoutes = require('./routes/auth')
const bookingRoutes = require('./routes/bookings')
const serviceRoutes = require('./routes/services')
const orderRoutes = require('./routes/orders')
const reviewRoutes = require('./routes/reviews')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app