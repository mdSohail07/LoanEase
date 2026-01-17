const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                kycStatus: user.kycStatus,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { name, mobile, dob, address, income, age, kycSubmitted } = req.body;
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name || user.name;
            user.mobile = mobile || user.mobile;
            user.dob = dob || user.dob;
            user.address = address || user.address;
            user.income = income || user.income;
            user.age = age || user.age;

            if (kycSubmitted) {
                user.kycStatus = 'pending';
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                kycStatus: updatedUser.kycStatus,
                mobile: updatedUser.mobile,
                dob: updatedUser.dob,
                address: updatedUser.address,
                income: updatedUser.income,
                age: updatedUser.age,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.calculateCreditScore = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const loans = await Loan.find({ userId: req.user._id });

        let score = 300; // Base score

        // Profile completeness (max +200)
        if (user.mobile) score += 50;
        if (user.dob) score += 50;
        if (user.address) score += 50;
        if (user.kycStatus === 'approved') score += 50;

        // Income factor
        if (user.income > 50000) score += 100;
        else if (user.income > 20000) score += 50;

        // Age factor (Stability)
        if (user.age >= 25 && user.age <= 55) score += 50;

        // Loan history (max +400)
        const paidLoans = loans.filter(l => l.status === 'disbursed' && l.repaymentSchedule.every(s => s.status === 'paid'));
        score += paidLoans.length * 100;

        // Cap at 850
        user.creditScore = Math.min(score, 850);
        await user.save();

        res.json({ creditScore: user.creditScore });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
