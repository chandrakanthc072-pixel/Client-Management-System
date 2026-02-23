// Test admin login
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/clientleadmanagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    testLogin();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

async function testLogin() {
    try {
        console.log('Testing admin login...');
        
        // Find admin user
        const user = await User.findOne({ username: 'admin' });
        
        if (!user) {
            console.log('❌ Admin user not found');
            process.exit(1);
        }
        
        console.log('✅ Admin user found:', user.username);
        
        // Test password
        const isMatch = await bcrypt.compare('admin123', user.password);
        
        if (isMatch) {
            console.log('✅ Password verification successful');
            console.log('Admin login credentials are working!');
            console.log('Username: admin');
            console.log('Password: admin123');
        } else {
            console.log('❌ Password verification failed');
            console.log('Creating new admin user...');
            
            // Delete and recreate
            await User.deleteOne({ username: 'admin' });
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new User({
                username: 'admin',
                password: hashedPassword
            });
            await admin.save();
            console.log('✅ New admin user created successfully');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error during login test:', error);
        process.exit(1);
    }
}
