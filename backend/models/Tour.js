const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  country: { type: String, required: true },
  price: { type: Number, required: true },
  startDate: Date,
  endDate: Date,
  operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Туроператор, який додав тур
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema);
