const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Loan = require('./models/Loan');
const Offer = require('./models/Offer');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/loanease', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.log(err));

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Loan.deleteMany({});
        await Offer.deleteMany({});

        console.log('Data Cleared');

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const userPassword = await bcrypt.hash('user123', salt);

        // Create Users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin'
        });

        const user = await User.create({
            name: 'John Doe',
            email: 'user@example.com',
            password: userPassword,
            role: 'user'
        });

        console.log('Users Created');

        // Create Loan Offers
        await Offer.create([
            {
                title: 'Personal Microloan',
                minAmount: 100,
                maxAmount: 1000,
                interestRate: 5,
                tenure: 12,
                description: 'Quick cash for small needs.'
            },
            {
                title: 'Small Business Loan',
                minAmount: 1000,
                maxAmount: 5000,
                interestRate: 4,
                tenure: 24,
                description: 'Grow your small business.'
            }
        ]);

        console.log('Offers Created');

        // Create Sample Loan
        await Loan.create({
            userId: user._id,
            amount: 500,
            tenure: 12,
            interestRate: 5,
            status: 'pending'
        });

        console.log('Sample Loan Created');

        console.log('Seeding Completed!');
        process.exit();
    } catch (error) {
        console.error('Error with seeding:', error);
        process.exit(1);
    }
};

seedData();
