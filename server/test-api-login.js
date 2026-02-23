// Test API login directly
const http = require('http');

const loginData = JSON.stringify({
    username: 'admin',
    password: 'admin@123'
});

const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Response:', data);
        try {
            const parsed = JSON.parse(data);
            if (parsed.token) {
                console.log('✅ Login successful!');
                console.log('Token:', parsed.token.substring(0, 50) + '...');
            } else {
                console.log('❌ Login failed:', parsed.message || parsed.error);
            }
        } catch (e) {
            console.log('❌ Invalid response format');
        }
    });
});

req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
});

req.write(loginData);
req.end();
