# Final Fix Instructions - Admin Login Issue

## Problem
You're getting "Invalid credentials" error when trying to login with admin credentials.

## Solution
The admin credentials need to be reset in the database. Here are the steps to fix this:

## Step 1: Reset Admin Credentials

Open Command Prompt or PowerShell in the server directory and run:

```bash
cd "c:\Users\HP\Downloads\Client lead Mangament System\server"
node quick-fix.js
```

If that doesn't work, try:
```bash
node force-reset-admin.js
```

## Step 2: Start the Server

```bash
node index.js
```

## Step 3: Login with New Credentials

- **Username**: `admin`
- **Password**: `admin@123`

## Alternative Manual Fix

If the scripts don't work, you can manually reset by:

1. Open `create-admin.js` and run it:
   ```bash
   node create-admin.js
   ```

2. Or use the change script:
   ```bash
   node change-admin-credentials.js admin admin@123
   ```

## Current Admin Credentials
- Username: `admin`
- Password: `admin@123`

## Files Created for Troubleshooting
- `quick-fix.js` - Simple admin reset script
- `force-reset-admin.js` - Force reset with verification
- `direct-fix.js` - Direct MongoDB connection fix
- `test-modules.js` - Test module loading
- `run-fix.bat` - Batch file to run fix

## Debug Logging Enabled
The auth.js file now has detailed logging to help troubleshoot login issues. Check the server console when attempting login to see detailed error messages.

## If Issues Persist
1. Make sure MongoDB is running on localhost:27017
2. Check that the database name is `clientleadmanagement`
3. Verify the server is running on port 5002
4. Check browser console for any frontend errors

The authentication should work correctly after running the reset script.
