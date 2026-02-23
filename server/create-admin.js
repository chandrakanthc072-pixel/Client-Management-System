// Simple admin creation script
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/clientleadmanagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    createAdmin();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

async function createAdmin() {
    try {
        // Remove existing admin if any
        await User.deleteOne({ username: 'admin' });
        console.log('Removed existing admin user');
        
        // Create new admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            username: 'admin',
            password: hashedPassword
        });
        
        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}
