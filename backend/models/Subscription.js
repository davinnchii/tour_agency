const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  agency: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // турагентство, яке підписується
  operator: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // туроператор
  service: { type: String, required: true }, // назва послуги
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
