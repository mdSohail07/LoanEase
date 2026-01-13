const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    title: { type: String, required: true },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    tenure: { type: Number, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Offer', OfferSchema);
