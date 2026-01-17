const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loanType: { type: String, enum: ['personal', 'business', 'education'], default: 'personal' },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true }, // in months
    interestRate: { type: Number, required: true },
    purpose: { type: String },
    emiAmount: { type: Number },
    status: { type: String, enum: ['pending', 'offered', 'approved', 'rejected', 'disbursed'], default: 'pending' },
    repaymentSchedule: [{
        dueDate: { type: Date },
        amount: { type: Number },
        status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    }],
    reason: { type: String }, // optional reason for rejection
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loan', LoanSchema);
