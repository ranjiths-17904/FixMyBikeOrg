# Server Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install nodemailer for email functionality:
```bash
npm install nodemailer
```

3. Create a `.env` file in the Server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URL=mongodb://127.0.0.1:27017/bikeServiceApp

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (optional - will use test account if not provided)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Email Service Configuration

### Option 1: Gmail (Recommended for development)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a password for "Mail"
3. Use the generated password in EMAIL_PASS

### Option 2: Test Account (Default)
If no email credentials are provided, the system will use Ethereal Email (test account) for development. Check the console for preview URLs.

### Option 3: Other Email Services
You can configure other email services by modifying the `emailService.js` file.

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Features Implemented

### User Registration with Email Verification
- ✅ Comprehensive form validation
- ✅ Password strength indicator
- ✅ Real-time field validation
- ✅ Email verification with OTP
- ✅ Unique user validation (username, email, mobile)
- ✅ Role-based registration (customer/owner)

### Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input sanitization and validation
- ✅ OTP expiration (10 minutes)

### Validation Rules
- **Username**: 3-30 characters, alphanumeric + underscore only
- **Email**: Valid email format, unique
- **Mobile**: 10-digit Indian mobile number, unique
- **Password**: Minimum 8 characters, strength indicator
- **Role**: Customer or Owner selection

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

## Testing the Email Service

1. Start the server
2. Try to register a new user
3. Check the console for email preview URLs (if using test account)
4. Verify the OTP functionality

## Troubleshooting

### Email Not Sending
- Check if nodemailer is installed
- Verify email credentials in .env file
- For Gmail, ensure App Password is used, not regular password
- Check console for error messages

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGO_URL in .env file
- Verify database name and connection string

### Validation Errors
- Check browser console for detailed error messages
- Verify all required fields are filled
- Ensure password meets strength requirements
