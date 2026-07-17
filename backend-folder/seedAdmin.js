// Ye script sirf EK BAAR chalayen taake database mein pehla admin account ban jaye.
// Run karne ka tareeqa:   node seedAdmin.js
//
// Kyunke admin register karne ka koi public API route jaan-boojh kar nahi rakha
// (security ke liye — koi bhi khud ko admin nahi bana sakta), isliye pehla
// admin account seedscript se banaya jata hai.

const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const connectDB = require('./config/db')
const Admin = require('./models/Admin')

dotenv.config()

async function seed() {
  await connectDB()

  const email = 'admin@clinic.com'
  const plainPassword = 'Admin@123'

  const existing = await Admin.findOne({ email })
  if (existing) {
    console.log('Admin already exists:', email)
    process.exit(0)
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10)
  await Admin.create({ email, password: hashedPassword })

  console.log('Admin created successfully!')
  console.log('Email:', email)
  console.log('Password:', plainPassword)
  process.exit(0)
}

seed()
