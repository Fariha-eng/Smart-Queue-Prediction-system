const jwt = require('jsonwebtoken')

// Ye middleware check karta hai ke request ke sath valid JWT token aaya hai ya nahi.
// Frontend se token "Authorization: Bearer <token>" header mein aana chahiye.
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please login.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // decoded mein { id, role } hoga (jab token banaya tha login ke waqt)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please login again.' })
  }
}

module.exports = authMiddleware
