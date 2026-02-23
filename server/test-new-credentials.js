// Test new admin credentials
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/clientleadmanagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    testNewCredentials();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

async function testNewCredentials() {
    try {
        console.log('Testing new admin credentials...');
        
        // Find admin user
        const user = await User.findOne({ username: 'admin' });
        
        if (!user) {
            console.log('❌ Admin user not found');
            process.exit(1);
        }
        
        console.log('✅ Admin user found:', user.username);
        
        // Test new password
        const isMatch = await bcrypt.compare('admin@123', user.password);
        
        if (isMatch) {
            console.log('✅ New password verification successful!');
            console.log('Admin credentials updated successfully!');
            console.log('Username: admin');
            console.log('Password: admin@123');
        } else {
            console.log('❌ Password verification failed');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error during test:', error);
        process.exit(1);
    }
}
