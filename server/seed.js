const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const user = await User.findOne({ username: 'admin' });
        if (user) {
            console.log('Admin user already exists');
            process.exit();
        }

        // Create new admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const newUser = new User({
            username: 'admin',
            password: hashedPassword
        });

        await newUser.save();
        console.log('Admin user created successfully');
        console.log('Username: admin');
        console.log('Password: admin123');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
