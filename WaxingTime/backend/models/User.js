const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'staff', 'admin'], default: 'client' },
  preferences: { type: Object, default: {} },
  visitHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Visit' }],
  loyaltyPoints: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);