const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  agency: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // турагентство, яке підписується
  operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // туроператор
  service: { type: String, required: true }, // назва послуги
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
