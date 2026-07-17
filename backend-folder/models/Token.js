const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    tokenNumber: { type: Number, required: true },
    status: { type: String, enum: ['waiting', 'served', 'cancelled'], default: 'waiting' }
  },
  { timestamps: true } // createdAt se pata chal jayega kaunsa token pehle bana
)

module.exports = mongoose.model('Token', tokenSchema)
