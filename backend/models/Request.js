const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // хто створив заявку
  agency: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // агенство, якщо заявка від агенства
  operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // оператор, якщо заявка від оператора
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
