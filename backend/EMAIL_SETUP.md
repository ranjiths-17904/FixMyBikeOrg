# Email Configuration Setup Guide

## Overview
This guide will help you configure real email delivery for OTP verification in the FixMyBike application.

## Current Status
The application is currently using Ethereal (test email service) which means:
- ✅ OTP codes are generated and logged to console
- ✅ You can view emails in Ethereal preview URLs
- ❌ Emails are NOT delivered to actual email addresses

## Setup Real Email Delivery

### Option 1: Gmail (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**
   - In Security settings, find "App passwords"
   - Click "Generate" for a new app password
   - Select "Mail" as the app type
   - Copy the generated 16-character password

3. **Create Environment File**
   Create a `.env` file in the `Server` directory:
   ```env
   # Email Configuration
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-16-character-app-password
   
   # Other configurations
   JWT_SECRET=your-super-secret-jwt-key-here
   MONGO_URL=mongodb://localhost:27017/bikeServiceApp
   PORT=5001
   NODE_ENV=development
   ```

4. **Restart Server**
   ```bash
   cd Server
   npm start
   ```

### Option 2: Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

#### Custom SMTP
If using a custom email provider, modify `services/otpService.js`:
```javascript
transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## Testing Email Configuration

1. **Start the server**
   ```bash
   cd Server
   npm start
   ```

2. **Test OTP sending**
   - Go to the signup page
   - Enter a valid email address
   - Click "Send OTP & Continue"
   - Check your email inbox (and spam folder)

3. **Check server logs**
   You should see:
   ```
   ✉️ Using Gmail SMTP for email delivery
   📧 Email sent successfully to: your-email@example.com
   📧 OTP Code: 123456
   ```

## Troubleshooting

### Common Issues

1. **"Gmail configuration failed"**
   - Verify 2FA is enabled
   - Check app password is correct
   - Ensure EMAIL_USER and EMAIL_PASS are set correctly

2. **"Authentication failed"**
   - Regenerate app password
   - Make sure you're using app password, not regular password

3. **"Connection timeout"**
   - Check internet connection
   - Verify Gmail SMTP settings
   - Try using a different network

4. **Email not received**
   - Check spam/junk folder
   - Verify email address is correct
   - Wait a few minutes for delivery

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

### Fallback Options

If Gmail doesn't work, the system will automatically fall back to:
1. Ethereal test account (preview URLs)
2. Mock email service (console logging)

## Security Best Practices

1. **Never commit .env files**
   - Add `.env` to `.gitignore`
   - Use environment variables in production

2. **Use App Passwords**
   - Never use your main Gmail password
   - Generate unique app passwords for each service

3. **Regular Updates**
   - Keep nodemailer updated
   - Monitor for security advisories

## Production Deployment

For production environments:

1. **Use Environment Variables**
   ```bash
   export EMAIL_USER=your-production-email@gmail.com
   export EMAIL_PASS=your-production-app-password
   ```

2. **Consider Email Services**
   - SendGrid
   - AWS SES
   - Mailgun
   - These provide better deliverability and monitoring

3. **Rate Limiting**
   - Implement rate limiting for OTP requests
   - Prevent abuse and spam

## Support

If you continue having issues:

1. Check the server logs for detailed error messages
2. Verify your email provider's SMTP settings
3. Test with a different email address
4. Consider using a different email provider

## Quick Test

To quickly test if email is working:

```bash
# In the Server directory
node -e "
const { sendEmailOTP } = require('./services/otpService');
sendEmailOTP('test@example.com', '123456', 'TestUser')
  .then(result => console.log('Result:', result))
  .catch(err => console.error('Error:', err));
"
```

This will attempt to send a test email and show the result.
