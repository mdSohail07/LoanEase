const Loan = require('../models/Loan');

exports.applyLoan = async (req, res) => {
    const { amount, tenure, interestRate, loanType, purpose } = req.body;

    try {
        // Simple EMI calculation: P * r * (1+r)^n / ((1+r)^n - 1)
        const monthlyRate = (interestRate / 100) / 12;
        const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);

        // Generate repayment schedule
        const repaymentSchedule = [];
        for (let i = 1; i <= tenure; i++) {
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + i);
            repaymentSchedule.push({
                dueDate,
                amount: emi.toFixed(2),
                status: 'pending'
            });
        }

        const loan = await Loan.create({
            userId: req.user._id,
            loanType,
            amount,
            tenure,
            interestRate,
            purpose,
            emiAmount: emi.toFixed(2),
            repaymentSchedule,
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

exports.disburseLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (loan) {
            loan.status = 'disbursed';
            await loan.save();

            // Notify user
            req.io.emit('loanStatusUpdate', {
                loanId: loan._id,
                userId: loan.userId,
                status: 'disbursed',
                amount: loan.amount,
                updatedAt: new Date()
            });

            res.json(loan);
        } else {
            res.status(404).json({ message: 'Loan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.acceptOffer = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (loan && loan.userId.toString() === req.user._id.toString()) {
            if (loan.status === 'offered') {
                loan.status = 'approved';
                await loan.save();
                res.json(loan);
            } else {
                res.status(400).json({ message: 'Loan is not in offered state' });
            }
        } else {
            res.status(404).json({ message: 'Loan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.payEMI = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        const { emiId } = req.body;
        if (loan) {
            const emi = loan.repaymentSchedule.id(emiId);
            if (emi) {
                emi.status = 'paid';
                await loan.save();
                res.json(loan);
            } else {
                res.status(404).json({ message: 'EMI not found' });
            }
        } else {
            res.status(404).json({ message: 'Loan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
