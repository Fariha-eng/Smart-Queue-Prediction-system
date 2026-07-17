const jwt = require('jsonwebtoken')

// payload mein hum id aur role dono daalte hain, taake middleware/role.js
// req.user.role check kar sake bina dubara database query kiye.
function generateToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

module.exports = generateToken
