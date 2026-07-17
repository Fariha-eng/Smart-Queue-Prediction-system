const express = require('express')
const bcrypt = require('bcryptjs')
const Doctor = require('../models/Doctor')
const authMiddleware = require('../middleware/auth')
const requireRole = require('../middleware/role')

const router = express.Router()

// ===================== GET ALL DOCTORS (public) =====================
// GET /api/doctors
// Patient side (DoctorList.vue, BookToken.vue) isay use karega
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password') // password kabhi frontend ko mat bhejo
    res.json(doctors)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ===================== ADD DOCTOR (admin only) =====================
// POST /api/doctors
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, password, specialty, availability } = req.body

    if (!name || !email || !password || !specialty || !availability) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    const existing = await Doctor.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'A doctor with this email already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const doctor = await Doctor.create({ name, email, password: hashedPassword, specialty, availability })

    const { password: _, ...doctorData } = doctor.toObject()
    res.status(201).json(doctorData)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ===================== UPDATE DOCTOR (admin only) =====================
// PUT /api/doctors/:id
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { name, specialty, availability } = req.body

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { name, specialty, availability },
      { new: true }
    ).select('-password')

    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' })

    res.json(doctor)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ===================== DELETE DOCTOR (admin only) =====================
// DELETE /api/doctors/:id
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id)
    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' })
    res.json({ message: 'Doctor deleted successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ===================== RESET QUEUE (admin OR the doctor themself) =====================
// PUT /api/doctors/:id/reset-queue
router.put('/:id/reset-queue', authMiddleware, requireRole('admin', 'doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { currentToken: 1 },
      { new: true }
    ).select('-password')

    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' })
    res.json(doctor)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ===================== NEXT PATIENT (doctor only) =====================
// PUT /api/doctors/:id/next-patient
router.put('/:id/next-patient', authMiddleware, requireRole('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $inc: { currentToken: 1 } },
      { new: true }
    ).select('-password')

    if (!doctor) return res.status(404).json({ message: 'Doctor not found.' })
    res.json(doctor)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
