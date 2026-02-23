// Direct fix without external dependencies first
console.log('Starting direct fix...');

// Check if we can connect to MongoDB
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function directFix() {
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db('clientleadmanagement');
        const users = db.collection('users');
        
        console.log('Deleting existing admin users...');
        const deleteResult = await users.deleteMany({ username: 'admin' });
        console.log('Deleted', deleteResult.deletedCount, 'admin users');
        
        console.log('Creating new admin user...');
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin@123', 10);
        
        const insertResult = await users.insertOne({
            username: 'admin',
            password: hashedPassword,
            __v: 0
        });
        
        console.log('✅ Admin user created with ID:', insertResult.insertedId);
        console.log('Username: admin');
        console.log('Password: admin@123');
        
        await client.close();
        console.log('✅ MongoDB connection closed');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

directFix();
