const express = require('express')
const bcrypt = require('bcryptjs')
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')
const Admin = require('../models/Admin')
const generateToken = require('../utils/generateToken')

const router = express.Router()

// ===================== PATIENT REGISTER =====================
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }

    const existing = await Patient.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'This email is already registered.' })
    }

    // Password ko hash kar ke save karo — kabhi bhi plain text save mat karo
    const hashedPassword = await bcrypt.hash(password, 10)

    const patient = await Patient.create({ name, email, password: hashedPassword })

    res.status(201).json({
      message: 'Registration successful!',
      patient: { id: patient._id, name: patient.name, email: patient.email }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ===================== PATIENT LOGIN =====================
// POST /api/auth/login/patient
router.post('/login/patient', async (req, res) => {
  try {
    const { email, password } = req.body
    const patient = await Patient.findOne({ email })

    if (!patient || !(await bcrypt.compare(password, patient.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = generateToken(patient._id, 'patient')
    res.json({
      token,
      user: { id: patient._id, name: patient.name, email: patient.email, role: 'patient' }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ===================== DOCTOR LOGIN =====================
// POST /api/auth/login/doctor
// Note: Doctor accounts sirf Admin create karta hai (koi public doctor-register route nahi hai)
router.post('/login/doctor', async (req, res) => {
  try {
    const { email, password } = req.body
    const doctor = await Doctor.findOne({ email })

    if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
      return res.status(401).json({ message: 'Invalid doctor credentials.' })
    }

    const token = generateToken(doctor._id, 'doctor')
    res.json({
      token,
      user: { id: doctor._id, name: doctor.name, email: doctor.email, role: 'doctor' }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ===================== ADMIN LOGIN =====================
// POST /api/auth/login/admin
router.post('/login/admin', async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid admin credentials.' })
    }

    const token = generateToken(admin._id, 'admin')
    res.json({
      token,
      user: { id: admin._id, email: admin.email, role: 'admin' }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
