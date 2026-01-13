const Loan = require('../models/Loan');

exports.applyLoan = async (req, res) => {
    const { amount, tenure, interestRate } = req.body;

    try {
        const loan = await Loan.create({
            userId: req.user._id,
            amount,
            tenure,
            interestRate,
            status: 'pending',
        });

        res.status(201).json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLoans = async (req, res) => {
    try {
        // If admin, return all loans; if user, return only their loans
        let loans;
        if (req.user.role === 'admin') {
            loans = await Loan.find({}).populate('userId', 'name email');
        } else {
            loans = await Loan.find({ userId: req.user._id });
        }
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLoanStatus = async (req, res) => {
    const { status, reason } = req.body;

    try {
        const loan = await Loan.findById(req.params.id);

        if (loan) {
            loan.status = status;
            if (reason) loan.reason = reason;
            const updatedLoan = await loan.save();

            // Emit real-time update using Socket.IO
            // Use req.io to emit
            req.io.emit('loanStatusUpdate', {
                loanId: updatedLoan._id,
                userId: updatedLoan.userId,
                status: updatedLoan.status,
                amount: updatedLoan.amount,
                updatedAt: new Date()
            });

            res.json(updatedLoan);
        } else {
            res.status(404).json({ message: 'Loan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
