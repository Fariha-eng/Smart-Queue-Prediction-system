// Ye middleware authMiddleware KE BAAD lagta hai (req.user pehle se set hona chahiye).
// Usage: router.post('/doctors', authMiddleware, requireRole('admin'), handler)
//
// allowedRoles ek ya zyada roles le sakta hai: requireRole('admin', 'doctor')
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' })
    }
    next()
  }
}

module.exports = requireRole
