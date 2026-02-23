// Force reset admin credentials
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/clientleadmanagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    forceResetAdmin();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

async function forceResetAdmin() {
    try {
        console.log('=== FORCE RESETTING ADMIN ===');
        
        // Delete any existing admin
        const deleteResult = await User.deleteMany({ username: 'admin' });
        console.log('Deleted', deleteResult.deletedCount, 'admin users');
        
        // Create fresh admin with known credentials
        const hashedPassword = await bcrypt.hash('admin@123', 10);
        const admin = new User({
            username: 'admin',
            password: hashedPassword
        });
        
        await admin.save();
        console.log('✅ Fresh admin user created');
        
        // Verify the credentials work
        const testUser = await User.findOne({ username: 'admin' });
        const isMatch = await bcrypt.compare('admin@123', testUser.password);
        
        if (isMatch) {
            console.log('✅ Credentials verified successfully!');
            console.log('Username: admin');
            console.log('Password: admin@123');
        } else {
            console.log('❌ Credential verification failed');
        }
        
        console.log('=== RESET COMPLETE ===');
        process.exit(0);
    } catch (error) {
        console.error('Reset error:', error);
        process.exit(1);
    }
}
