// Debug authentication issue
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/clientleadmanagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    debugAuth();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

async function debugAuth() {
    try {
        console.log('=== DEBUGGING AUTHENTICATION ===');
        
        // Check all users in database
        const allUsers = await User.find({});
        console.log('Total users in database:', allUsers.length);
        
        allUsers.forEach(user => {
            console.log('User:', user.username, 'ID:', user._id);
        });
        
        // Find admin user
        const admin = await User.findOne({ username: 'admin' });
        
        if (!admin) {
            console.log('❌ Admin user not found - creating new one...');
            const hashedPassword = await bcrypt.hash('admin@123', 10);
            const newAdmin = new User({
                username: 'admin',
                password: hashedPassword
            });
            await newAdmin.save();
            console.log('✅ New admin created');
        } else {
            console.log('✅ Admin user found:', admin.username);
            
            // Test various passwords
            const passwords = ['admin123', 'admin@123', 'password'];
            
            for (const pwd of passwords) {
                const isMatch = await bcrypt.compare(pwd, admin.password);
                console.log(`Password "${pwd}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
            }
            
            // If admin@123 doesn't match, update it
            const correctMatch = await bcrypt.compare('admin@123', admin.password);
            if (!correctMatch) {
                console.log('Updating admin password to admin@123...');
                const hashedPassword = await bcrypt.hash('admin@123', 10);
                await User.updateOne({ username: 'admin' }, { password: hashedPassword });
                console.log('✅ Password updated');
                
                // Test again
                const newMatch = await bcrypt.compare('admin@123', admin.password);
                console.log(`After update - Password "admin@123": ${newMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
            }
        }
        
        console.log('=== DEBUG COMPLETE ===');
        process.exit(0);
    } catch (error) {
        console.error('Debug error:', error);
        process.exit(1);
    }
}
