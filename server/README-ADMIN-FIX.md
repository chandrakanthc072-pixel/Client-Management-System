# Admin Access Fix - Client Lead Management System

## Issue Fixed
Admin access was showing "invalid credentials" error.

## Root Cause
- No admin user was created in the database
- MongoDB connection string was incomplete (missing database name)

## Solution Applied

### 1. Fixed Database Connection
- Updated `.env` file to include database name: `clientleadmanagement`
- Connection string now: `mongodb://localhost:27017/clientleadmanagement`

### 2. Created Admin User Management Scripts
- `create-admin.js` - Creates/refreshes admin user
- `test-login.js` - Tests admin login credentials
- Added npm scripts for easy management

### 3. Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`

## Usage

### Start Server
```bash
npm start
# or
npm run dev
```

### Create/Reset Admin User
```bash
npm run create-admin
```

### Test Admin Login
```bash
node test-login.js
```

### API Login Endpoint
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Files Modified
- `server/.env` - Fixed MongoDB URI
- `server/package.json` - Added admin management scripts
- Created admin management scripts

## Authentication Flow
1. Client sends POST request to `/api/auth/login`
2. Server validates username/password against database
3. If valid, returns JWT token and user info
4. Client uses token for authenticated requests

The admin access issue is now resolved. Use credentials `admin/admin123` to login.
