console.log('Starting simple test...');

try {
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const dotenv = require('dotenv');

    console.log('All modules loaded successfully');
    
    dotenv.config();
    console.log('Environment loaded');
    console.log('MONGO_URI:', process.env.MONGO_URI);

} catch (error) {
    console.error('Error loading modules:', error);
}
