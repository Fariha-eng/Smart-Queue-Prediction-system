const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true } // hashed, plain text kabhi save nahi hoga
  },
  { timestamps: true } // createdAt / updatedAt automatically milta hai
)

module.exports = mongoose.model('Patient', patientSchema)
