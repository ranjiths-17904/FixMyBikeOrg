# FixMyBike Server Deployment Checklist

## ✅ Pre-Deployment Checks

### 1. Environment Variables
- [ ] `MONGO_URL` is set to production MongoDB instance
- [ ] `JWT_SECRET` is set to a strong, unique secret
- [ ] `NODE_ENV` is set to `production`
- [ ] `PORT` is set (Render will override this automatically)

### 2. CORS Configuration
- [ ] Client domain is added to CORS origins
- [ ] HTTPS is used for production domains

### 3. Database
- [ ] MongoDB connection string is correct
- [ ] Database is accessible from Render's servers

### 4. Security
- [ ] JWT secret is strong and unique
- [ ] No hardcoded secrets in code

### 5. Dependencies
- [ ] Express version is 4.x (not 5.x for production stability)
- [ ] All dependencies are compatible

### 6. API Paths
- [ ] All client API calls use `/api/` prefix
- [ ] Server routes are mounted at `/api/` prefix
- [ ] No duplicate `/api/` paths in client configuration

## 🚀 Render Deployment Steps

1. **Connect GitHub Repository**
   - Link your GitHub repo to Render
   - Set branch to `main` or `master`

2. **Environment Variables**
   ```
   MONGO_URL=your_production_mongodb_url
   JWT_SECRET=your_strong_jwt_secret
   NODE_ENV=production
   ```

3. **Build Command**
   ```
   npm install
   ```

4. **Start Command**
   ```
   npm start
   ```

5. **Health Check Path**
   ```
   /api/health
   ```

## 🔍 Troubleshooting

### Common Issues:
1. **Express 5.x Compatibility**: Use Express 4.x for production stability
2. **API Path Mismatch**: Ensure client calls `/api/auth/login`, not `/auth/login`
3. **404 Errors**: Check if routes are properly mounted
4. **CORS Errors**: Verify CORS origins include client domain
5. **Database Connection**: Check MongoDB connection string
6. **Environment Variables**: Ensure all required vars are set

### Testing Endpoints:
- Root: `https://fixmybike-server.onrender.com/`
- Health: `https://fixmybike-server.onrender.com/api/health`
- Auth: `https://fixmybike-server.onrender.com/api/auth/login`

## 📱 Client Configuration

Ensure client `api.js` has:
```javascript
const resolvedBaseUrl = 'https://fixmybike-server.onrender.com';
```

And all API calls use the correct prefix:
```javascript
// ✅ Correct
api.post('/api/auth/login', data)
api.get('/api/bookings')

// ❌ Incorrect
api.post('/auth/login', data)
api.get('/bookings')
```

## 🔧 Monitoring

- Check Render logs for errors
- Monitor MongoDB connection
- Test all API endpoints after deployment

## 🚨 Critical Fixes Applied

**Express Version**: Downgraded from 5.1.0 to 4.18.2 for production stability
**Route Handler**: Fixed 404 handler to be compatible with Express 4.x
**API Paths**: Fixed all client API calls to use `/api/` prefix
**Deployment**: Use `npm start` (not `npm run dev`) for production
**Test Files**: Removed unnecessary test files from production deployment
**Error Handling**: Improved API error handling and session management
**Debug Logging**: Added comprehensive logging for troubleshooting

## 🔧 Recent Fixes (Latest Deployment)

### 1. API Path Corrections
- ✅ Fixed missing `/api` prefix in customer Dashboard delete booking
- ✅ Fixed missing `/api` prefix in owner BookingManagement status updates
- ✅ Fixed missing `/api` prefix in owner BookingManagement work completion
- ✅ Fixed missing `/api` prefix in owner BookingManagement receipt sending

### 2. Session Management Improvements
- ✅ Less aggressive session expiration handling
- ✅ Added session validation function
- ✅ Improved error logging and debugging
- ✅ Better user experience for expired sessions

### 3. Code Cleanup
- ✅ Removed test-*.js files from production
- ✅ Enhanced API error logging
- ✅ Added request/response debugging

## 🧪 Testing Checklist

After deployment, test these endpoints:
- [x] Root endpoint (`/`) - ✅ Working
- [x] Health check (`/api/health`) - ✅ Working
- [ ] Auth endpoints (`/api/auth/*`) - Test with client
- [ ] Booking endpoints (`/api/bookings/*`) - Test with client
- [ ] User endpoints (`/api/users/*`) - Test with client
- [ ] Notification endpoints (`/api/notifications/*`) - Test with client
- [ ] Payment endpoints (`/api/payments/*`) - Test with client

## 🐛 Troubleshooting Guide

### If you still get 404 errors:
1. Check browser console for exact API calls being made
2. Verify all client API calls use `/api/` prefix
3. Check if server is running and accessible
4. Use the test-api.html page to verify endpoints

### If you get session expired errors:
1. Check if JWT token is valid
2. Verify server JWT_SECRET is set correctly
3. Check browser console for authentication errors
4. Try logging in again

### If API calls fail:
1. Check network tab in browser dev tools
2. Verify CORS is configured correctly
3. Check server logs for errors
4. Test endpoints manually using test-api.html
