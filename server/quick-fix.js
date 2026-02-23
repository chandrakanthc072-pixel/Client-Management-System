console.log('Starting quick fix...');

try {
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    
    console.log('All modules loaded successfully');
    
    mongoose.connect('mongodb://localhost:27017/clientleadmanagement')
        .then(() => {
            console.log('✅ Connected to MongoDB');
            resetAdmin();
        })
        .catch(err => {
            console.error('❌ MongoDB connection failed:', err.message);
            process.exit(1);
        });
    
    async function resetAdmin() {
        try {
            console.log('Deleting existing admin users...');
            await User.deleteMany({ username: 'admin' });
            
            console.log('Creating new admin user...');
            const hashedPassword = await bcrypt.hash('admin@123', 10);
            const admin = new User({
                username: 'admin',
                password: hashedPassword
            });
            
            await admin.save();
            console.log('✅ Admin user created successfully!');
            console.log('Username: admin');
            console.log('Password: admin@123');
            
            process.exit(0);
        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    }
    
} catch (error) {
    console.error('❌ Module loading error:', error.message);
    process.exit(1);
}
