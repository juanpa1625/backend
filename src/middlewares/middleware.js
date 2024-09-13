import { allowedOrigins } from '../config/config.js'

export const validateCORS = (req, res, next) => {
  try {
    const { origin } = req.headers
    console.log(origin)

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization')
      next()
    } else {
      res.status(403).json({ message: 'No permitido por CORS' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
