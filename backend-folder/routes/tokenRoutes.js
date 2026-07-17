const express = require('express')
const Token = require('../models/Token')
const Doctor = require('../models/Doctor')
const authMiddleware = require('../middleware/auth')
const requireRole = require('../middleware/role')

const router = express.Router()

// ===================== BOOK A TOKEN (patient only) =====================
// POST /api/tokens/book   body: { doctorId }
router.post('/book', authMiddleware, requireRole('patient'), async (req, res) => {
  try {
    const { doctorId } = req.body
    const doctor = await Doctor.findById(doctorId)

    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' })

    // Aaj ke din is doctor ke liye ab tak kitne tokens ban chuke hain, unse agla number do
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const tokensToday = await Token.countDocuments({
      doctor: doctorId,
      createdAt: { $gte: startOfDay }
    })

    const tokenNumber = doctor.currentToken + tokensToday + 1

    const newToken = await Token.create({
      doctor: doctorId,
      patient: req.user.id,
      tokenNumber,
      status: 'waiting'
    })

    res.status(201).json(newToken)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ===================== MY QUEUE STATUS (patient only) =====================
// GET /api/tokens/my-status
// Patient ka sab se latest (aaj ka) booking + queue position return karta hai
router.get('/my-status', authMiddleware, requireRole('patient'), async (req, res) => {
  try {
    const latestToken = await Token.findOne({ patient: req.user.id, status: 'waiting' })
      .sort({ createdAt: -1 })
      .populate('doctor', 'name specialty currentToken')

    if (!latestToken) {
      return res.json({ hasBooking: false })
    }

    const peopleAhead = Math.max(latestToken.tokenNumber - latestToken.doctor.currentToken, 0)
    const MINUTES_PER_PATIENT = 5

    res.json({
      hasBooking: true,
      doctorName: latestToken.doctor.name,
      currentToken: latestToken.doctor.currentToken,
      myToken: latestToken.tokenNumber,
      peopleAhead,
      waitingTime: peopleAhead * MINUTES_PER_PATIENT
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
