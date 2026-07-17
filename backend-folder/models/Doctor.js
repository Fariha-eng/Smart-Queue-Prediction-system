const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed — admin isay set karta hai jab doctor add hota hai
    specialty: { type: String, required: true },
    availability: { type: String, required: true },
    currentToken: { type: Number, default: 1 } // abhi kaunsa token serve ho raha hai
  },
  { timestamps: true }
)

module.exports = mongoose.model('Doctor', doctorSchema)
