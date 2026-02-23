console.log('=== MODULE TEST ===');
console.log('Current directory:', process.cwd());

const fs = require('fs');
console.log('Admin-related files:');
fs.readdirSync('.').forEach(file => {
    if (file.includes('admin')) {
        console.log('  -', file);
    }
});

try {
    console.log('Loading modules...');
    const mongoose = require('mongoose');
    console.log('✅ mongoose loaded');
    
    const bcrypt = require('bcryptjs');
    console.log('✅ bcryptjs loaded');
    
    const User = require('./models/User');
    console.log('✅ User model loaded');
    
    console.log('All modules loaded successfully!');
} catch (error) {
    console.error('❌ Error:', error.message);
}

console.log('=== TEST COMPLETE ===');
