const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true }, // in months
    interestRate: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reason: { type: String }, // optional reason for rejection
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loan', LoanSchema);
