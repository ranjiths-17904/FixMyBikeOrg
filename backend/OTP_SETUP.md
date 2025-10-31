# OTP Authentication Setup Guide

## Overview
This guide explains how to set up OTP (One-Time Password) authentication for user registration in the FixMyBike application.

## Features
- Email-based OTP verification during registration
- 6-digit OTP codes with 5-minute expiration
- Resend OTP functionality with 60-second cooldown
- Secure password creation after OTP verification

## Email Configuration

### 1. Gmail Setup (Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated password in your environment variables

### 2. Environment Variables
Create a `.env` file in the `Server` directory with the following variables:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration for OTP
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/fixmybike

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Alternative Email Providers
You can modify the email configuration in `services/otpService.js` to use other email providers:

```javascript
// For Outlook/Hotmail
this.transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// For custom SMTP
this.transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## API Endpoints

### 1. Send OTP
- **POST** `/auth/send-otp`
- **Body**: `{ "email": "user@example.com", "username": "username" }`
- **Response**: `{ "success": true, "tempUserId": "user_id", "message": "Verification code sent" }`

### 2. Verify OTP
- **POST** `/auth/verify-otp`
- **Body**: `{ "tempUserId": "user_id", "otp": "123456", "password": "password" }`
- **Response**: `{ "success": true, "token": "jwt_token", "user": {...} }`

### 3. Resend OTP
- **POST** `/auth/resend-otp`
- **Body**: `{ "tempUserId": "user_id" }`
- **Response**: `{ "success": true, "message": "New verification code sent" }`

## User Registration Flow

1. **Initial Registration**: User enters username and email
2. **OTP Generation**: System generates 6-digit OTP and sends via email
3. **Temporary User**: Creates temporary user record with OTP
4. **OTP Verification**: User enters OTP and password
5. **Account Creation**: System verifies OTP and creates permanent account
6. **Login**: User is automatically logged in

## Security Features

- **OTP Expiration**: 5 minutes
- **Resend Cooldown**: 60 seconds
- **Password Hashing**: bcrypt with salt rounds of 10
- **JWT Tokens**: 7-day expiration
- **Email Validation**: Proper email format validation
- **Duplicate Prevention**: Checks for existing users before OTP generation

## Database Schema Updates

The User model now includes OTP-related fields:

```javascript
{
  emailVerified: Boolean,
  emailOtp: {
    code: String,
    expiresAt: Date
  },
  mobileVerified: Boolean,
  mobileOtp: {
    code: String,
    expiresAt: Date
  }
}
```

## Testing

### 1. Test Email Configuration
```bash
# Start the server
npm start

# Test OTP sending (replace with your email)
curl -X POST http://localhost:5000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser"}'
```

### 2. Frontend Testing
1. Navigate to the signup page
2. Enter valid username and email
3. Click "Create Account"
4. Check your email for the OTP
5. Enter the OTP and password
6. Complete registration

## Troubleshooting

### Common Issues

1. **Email not sending**:
   - Check email credentials in `.env`
   - Verify 2FA is enabled for Gmail
   - Check app password is correct

2. **OTP not received**:
   - Check spam folder
   - Verify email address is correct
   - Check server logs for errors

3. **OTP expired**:
   - Use resend functionality
   - Wait for 60-second cooldown

4. **Database errors**:
   - Ensure MongoDB is running
   - Check connection string
   - Verify database permissions

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## Production Considerations

1. **Email Service**: Use a reliable email service (SendGrid, AWS SES, etc.)
2. **Rate Limiting**: Implement rate limiting for OTP requests
3. **Monitoring**: Add logging and monitoring for OTP failures
4. **Backup**: Implement SMS OTP as backup for email failures
5. **Security**: Use environment variables for all sensitive data
