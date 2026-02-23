// Test Client API endpoints
const http = require('http');

// Configuration
const BASE_URL = 'localhost';
const PORT = 5002;

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: BASE_URL,
            port: PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = token;
        }

        if (data) {
            const postData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Test functions
async function testAuthentication() {
    console.log('=== Testing Authentication ===');
    
    try {
        const loginResponse = await makeRequest('/api/auth/login', 'POST', {
            username: 'admin',
            password: 'admin@123'
        });
        
        if (loginResponse.status === 200 && loginResponse.data.token) {
            console.log('✅ Login successful');
            return loginResponse.data.token;
        } else {
            console.log('❌ Login failed:', loginResponse.data);
            return null;
        }
    } catch (error) {
        console.log('❌ Authentication error:', error.message);
        return null;
    }
}

async function testCreateClient(token) {
    console.log('\n=== Testing Create Client ===');
    
    const clientData = {
        name: {
            firstName: 'John',
            lastName: 'Doe',
            company: 'Tech Corp'
        },
        primaryEmail: 'john.doe@techcorp.com',
        contacts: [
            {
                type: 'Email',
                value: 'john.doe@techcorp.com',
                isPrimary: true
            },
            {
                type: 'Phone',
                value: '+1-555-0123'
            }
        ],
        address: {
            street: '123 Tech Street',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105'
        },
        jobTitle: 'CEO',
        industry: 'Technology',
        website: 'https://techcorp.com',
        status: 'Lead',
        source: 'Website',
        budget: 50000,
        tags: ['enterprise', 'technology', 'priority']
    };

    try {
        const response = await makeRequest('/api/clients', 'POST', clientData, token);
        
        if (response.status === 201) {
            console.log('✅ Client created successfully');
            console.log('Client ID:', response.data.client._id);
            return response.data.client._id;
        } else {
            console.log('❌ Create client failed:', response.data);
            return null;
        }
    } catch (error) {
        console.log('❌ Create client error:', error.message);
        return null;
    }
}

async function testGetClients(token) {
    console.log('\n=== Testing Get Clients ===');
    
    try {
        const response = await makeRequest('/api/clients', 'GET', null, token);
        
        if (response.status === 200) {
            console.log('✅ Get clients successful');
            console.log('Total clients:', response.data.clients.length);
            console.log('Pagination:', response.data.pagination);
            return response.data.clients;
        } else {
            console.log('❌ Get clients failed:', response.data);
            return [];
        }
    } catch (error) {
        console.log('❌ Get clients error:', error.message);
        return [];
    }
}

async function testUpdateClient(token, clientId) {
    console.log('\n=== Testing Update Client ===');
    
    const updateData = {
        name: {
            firstName: 'John',
            lastName: 'Smith',
            company: 'Tech Corp Inc'
        },
        status: 'Active Client',
        budget: 75000
    };

    try {
        const response = await makeRequest(`/api/clients/${clientId}`, 'PUT', updateData, token);
        
        if (response.status === 200) {
            console.log('✅ Client updated successfully');
            console.log('New status:', response.data.client.status);
            return true;
        } else {
            console.log('❌ Update client failed:', response.data);
            return false;
        }
    } catch (error) {
        console.log('❌ Update client error:', error.message);
        return false;
    }
}

async function testAddNote(token, clientId) {
    console.log('\n=== Testing Add Note ===');
    
    try {
        const response = await makeRequest(`/api/clients/${clientId}/notes`, 'POST', {
            text: 'Initial consultation completed. Client interested in premium package.'
        }, token);
        
        if (response.status === 200) {
            console.log('✅ Note added successfully');
            console.log('Total notes:', response.data.client.notes.length);
            return true;
        } else {
            console.log('❌ Add note failed:', response.data);
            return false;
        }
    } catch (error) {
        console.log('❌ Add note error:', error.message);
        return false;
    }
}

async function testGetStats(token) {
    console.log('\n=== Testing Get Statistics ===');
    
    try {
        const response = await makeRequest('/api/clients/stats/overview', 'GET', null, token);
        
        if (response.status === 200) {
            console.log('✅ Statistics retrieved successfully');
            console.log('Total clients:', response.data.total);
            console.log('Recent clients:', response.data.recent);
            console.log('By status:', response.data.byStatus);
            return true;
        } else {
            console.log('❌ Get stats failed:', response.data);
            return false;
        }
    } catch (error) {
        console.log('❌ Get stats error:', error.message);
        return false;
    }
}

// Main test function
async function runTests() {
    console.log('🚀 Starting Client API Tests...\n');
    
    // Test authentication
    const token = await testAuthentication();
    if (!token) {
        console.log('\n❌ Cannot proceed without authentication');
        return;
    }
    
    // Test create client
    const clientId = await testCreateClient(token);
    if (!clientId) {
        console.log('\n❌ Cannot proceed without client creation');
        return;
    }
    
    // Test get clients
    await testGetClients(token);
    
    // Test update client
    await testUpdateClient(token, clientId);
    
    // Test add note
    await testAddNote(token, clientId);
    
    // Test get statistics
    await testGetStats(token);
    
    console.log('\n🎉 All tests completed!');
}

// Run tests
runTests().catch(console.error);
