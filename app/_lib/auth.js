import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'pawport-secret-key-change-in-production'

export function authenticate(req) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided, authorization denied.', status: 401 }
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return { user: decoded }
  } catch (error) {
    return { error: 'Token is not valid.', status: 401 }
  }
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}