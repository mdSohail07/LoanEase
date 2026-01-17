const User = require('../models/User');
const Loan = require('../models/Loan');

exports.getPendingKYCs = async (req, res) => {
    try {
        const users = await User.find({ kycStatus: 'pending' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyKYC = async (req, res) => {
    const { userId, status } = req.body;
    try {
        const user = await User.findById(userId);
        if (user) {
            user.kycStatus = status;
            await user.save();

            // Notify user via Socket.IO
            req.io.emit('kycStatusUpdate', {
                userId: user._id,
                status: status,
                updatedAt: new Date()
            });

            res.json({ message: `KYC ${status}` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalLoans = await Loan.countDocuments();
        const pendingLoans = await Loan.countDocuments({ status: 'pending' });
        const activeLoans = await Loan.countDocuments({ status: 'disbursed' });

        const totalDisbursed = await Loan.aggregate([
            { $match: { status: 'disbursed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Monthly disbursement data (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyData = await Loan.aggregate([
            { $match: { status: 'disbursed', createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Loan type distribution
        const typeDistribution = await Loan.aggregate([
            { $group: { _id: "$loanType", count: { $sum: 1 } } }
        ]);

        res.json({
            totalUsers,
            totalLoans,
            pendingLoans,
            activeLoans,
            totalDisbursed: totalDisbursed[0]?.total || 0,
            monthlyData,
            typeDistribution
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.calculateRepaymentProgress = async (req, res) => {
    try {
        const totalAmount = await Loan.aggregate([
            { $match: { status: 'disbursed' } },
            { $unwind: "$repaymentSchedule" },
            { $group: { _id: "$repaymentSchedule.status", total: { $sum: "$repaymentSchedule.amount" } } }
        ]);
        res.json(totalAmount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
