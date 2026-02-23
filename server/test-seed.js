const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

console.log('Testing database connection...');
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected successfully');
        testOperations();
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

async function testOperations() {
    try {
        console.log('Checking for existing admin user...');
        const user = await User.findOne({ username: 'admin' });
        
        if (user) {
            console.log('Admin user already exists:');
            console.log('Username:', user.username);
            console.log('User ID:', user._id);
            
            // Test password comparison
            const isMatch = await bcrypt.compare('admin123', user.password);
            console.log('Password "admin123" matches:', isMatch);
            
        } else {
            console.log('Admin user not found, creating...');
            
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const newUser = new User({
                username: 'admin',
                password: hashedPassword
            });

            await newUser.save();
            console.log('Admin user created successfully');
            console.log('Username: admin');
            console.log('Password: admin123');
        }
        
        process.exit();
    } catch (error) {
        console.error('Error during operations:', error);
        process.exit(1);
    }
}
