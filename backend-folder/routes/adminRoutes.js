const express = require('express')
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')
const Token = require('../models/Token')
const authMiddleware = require('../middleware/auth')
const requireRole = require('../middleware/role')

const router = express.Router()

// Sab admin routes ke liye login + admin role zaroori hai
router.use(authMiddleware, requireRole('admin'))

// ===================== GET ALL PATIENTS =====================
// GET /api/admin/patients
router.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find().select('-password')
    res.json(patients)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ===================== DELETE / REMOVE A PATIENT =====================
// DELETE /api/admin/patients/:id
router.delete('/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id)
    if (!patient) return res.status(404).json({ message: 'Patient not found.' })
    res.json({ message: 'Patient removed successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ===================== DASHBOARD STATS =====================
// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments()
    const totalPatients = await Patient.countDocuments()

    const doctors = await Doctor.find().select('currentToken')
    const totalTokensInQueue = doctors.reduce((sum, d) => sum + d.currentToken, 0)

    const totalBookingsToday = await Token.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    })

    res.json({ totalDoctors, totalPatients, totalTokensInQueue, totalBookingsToday })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
