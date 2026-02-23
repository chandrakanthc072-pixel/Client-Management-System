// Change admin credentials script
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Get new credentials from command line arguments
const args = process.argv.slice(2);
const newUsername = args[0];
const newPassword = args[1];

if (!newUsername || !newPassword) {
    console.log('Usage: node change-admin-credentials.js <new_username> <new_password>');
    console.log('Example: node change-admin-credentials.js myadmin mypassword123');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/clientleadmanagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    changeCredentials();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

async function changeCredentials() {
    try {
        // Remove existing admin user
        await User.deleteOne({ username: 'admin' });
        console.log('Removed old admin user');
        
        // Create new admin with new credentials
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const admin = new User({
            username: newUsername,
            password: hashedPassword
        });
        
        await admin.save();
        console.log('✅ Admin credentials updated successfully!');
        console.log('New Username:', newUsername);
        console.log('New Password:', newPassword);
        
        process.exit(0);
    } catch (error) {
        console.error('Error updating credentials:', error);
        process.exit(1);
    }
}
