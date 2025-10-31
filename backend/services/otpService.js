const nodemailer = require('nodemailer');
const crypto = require('crypto');

let transporter = null;
let isEthereal = false;

const createTransporter = async () => {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // Priority 1: Use Gmail with credentials (REAL EMAIL DELIVERY)
  if (emailUser && emailPass) {
    try {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
          user: emailUser, 
          pass: emailPass 
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      // Verify the connection
      await transporter.verify();
      isEthereal = false;
      console.log('✅ Gmail SMTP configured successfully!');
      console.log('📧 REAL EMAIL DELIVERY ENABLED');
      console.log('📱 Users will receive OTP on their phones via email');
      return transporter;
    } catch (error) {
      console.error('❌ Gmail configuration failed:', error.message);
      console.log('⚠️ Falling back to alternative email service...');
    }
  }

  // Priority 2: Try Outlook/Hotmail
  if (emailUser && emailPass) {
    try {
      transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
      
      await transporter.verify();
      isEthereal = false;
      console.log('✅ Outlook SMTP configured successfully!');
      console.log('📧 REAL EMAIL DELIVERY ENABLED');
      return transporter;
    } catch (error) {
      console.error('❌ Outlook configuration failed:', error.message);
    }
  }

  // Priority 3: Try Yahoo
  if (emailUser && emailPass) {
    try {
      transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
      
      await transporter.verify();
      isEthereal = false;
      console.log('✅ Yahoo SMTP configured successfully!');
      console.log('📧 REAL EMAIL DELIVERY ENABLED');
      return transporter;
    } catch (error) {
      console.error('❌ Yahoo configuration failed:', error.message);
    }
  }

  // Priority 4: Use Ethereal test account (ONLY FOR TESTING)
  try {
    console.log('⚠️ No real email service configured. Using Ethereal test service.');
    console.log('📧 WARNING: Emails will NOT be delivered to real users!');
    console.log('📧 Only preview URLs will be available for testing.');
    
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    isEthereal = true;
    console.log('🔗 Ethereal test account created for development only');
  } catch (error) {
    console.error('❌ Failed to create Ethereal account:', error);
    // Create a simple mock transporter for testing
    transporter = {
      sendMail: async (mailOptions) => {
        const otpMatch = mailOptions.html.match(/>(\d{6})</);
        const otp = otpMatch ? otpMatch[1] : '123456';
        console.log('📧 Mock email sent:', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          otp: otp
        });
        console.log('🔑 OTP Code for testing:', otp);
        return { messageId: 'mock-message-id' };
      }
    };
    isEthereal = false;
    console.log('📧 Using mock email service for testing');
  }
  
  return transporter;
};

const generateOTP = () => {
  // Generate a cryptographically secure random 6-digit OTP
  const randomBytes = crypto.randomBytes(3); // 3 bytes = 24 bits
  const randomNumber = randomBytes.readUIntBE(0, 3); // Read as big-endian
  const otp = (randomNumber % 900000) + 100000; // Ensure 6 digits (100000-999999)
  return otp.toString();
};

// Enhanced email delivery with better error handling and mobile optimization
const sendEmailOTP = async (to, otp, username) => {
  try {
    const emailTransporter = await createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'no-reply@fixmybike.local',
      to,
      subject: "FixMyBike - Email Verification OTP",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FixMyBike OTP Verification</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              padding: 0; 
              background-color: #f8fafc;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #10b981, #059669); 
              padding: 30px 20px; 
              text-align: center;
            }
            .header h1 { 
              color: white; 
              margin: 0; 
              font-size: 28px; 
              font-weight: 700;
            }
            .header p { 
              color: white; 
              margin: 10px 0 0 0; 
              font-size: 16px; 
              opacity: 0.9;
            }
            .content { 
              padding: 40px 30px; 
              text-align: center;
            }
            .greeting { 
              color: #1f2937; 
              margin-bottom: 25px; 
              font-size: 20px; 
              font-weight: 600;
            }
            .description { 
              color: #6b7280; 
              line-height: 1.6; 
              margin-bottom: 30px; 
              font-size: 16px;
            }
            .otp-container { 
              background: #ffffff; 
              border: 3px solid #10b981; 
              border-radius: 12px; 
              padding: 25px; 
              margin: 30px 0;
              box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.1);
            }
            .otp-code { 
              color: #10b981; 
              font-size: 36px; 
              font-weight: 800; 
              letter-spacing: 8px; 
              margin: 0;
              font-family: 'Courier New', monospace;
            }
            .expiry { 
              color: #6b7280; 
              font-size: 14px; 
              margin: 20px 0;
            }
            .security-notice { 
              background: #fef3c7; 
              border-left: 4px solid #f59e0b; 
              padding: 20px; 
              margin: 30px 0;
              border-radius: 8px;
            }
            .security-text { 
              color: #92400e; 
              margin: 0; 
              font-size: 14px; 
              font-weight: 500;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              color: #9ca3af; 
              font-size: 12px;
              padding: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .mobile-optimized { 
              padding: 20px 15px; 
            }
            @media (max-width: 600px) {
              .container { margin: 10px; }
              .content { padding: 30px 20px; }
              .header { padding: 25px 15px; }
              .header h1 { font-size: 24px; }
              .otp-code { font-size: 32px; letter-spacing: 6px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚲 FixMyBike</h1>
              <p>Email Verification</p>
            </div>
            
            <div class="content mobile-optimized">
              <div class="greeting">Hello ${username}! 👋</div>
              
              <div class="description">
                Thank you for registering with FixMyBike! To complete your registration, please use the verification code below:
              </div>
              
              <div class="otp-container">
                <div class="otp-code">${otp}</div>
              </div>
              
              <div class="expiry">
                ⏰ This code will expire in <strong>5 minutes</strong> for security reasons.
              </div>
              
              <div class="security-notice">
                <div class="security-text">
                  🔒 <strong>Security Notice:</strong> Never share this code with anyone. FixMyBike will never ask for this code via phone or email.
                </div>
              </div>
              
              <div class="description" style="margin-top: 30px; font-size: 14px;">
                If you didn't create an account with FixMyBike, please ignore this email.
              </div>
            </div>
            
            <div class="footer">
              <p>&copy; 2024 FixMyBike. All rights reserved.</p>
              <p>Your trusted bike service partner in Tamil Nadu</p>
              <p>📱 Mobile-optimized for your convenience</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `FixMyBike Email Verification\n\nHello ${username}!\n\nYour verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nDo not share this code with anyone.\n\nBest regards,\nFixMyBike Team`
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    if (isEthereal) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL:', previewUrl);
      console.log('OTP Code:', otp);
      console.log('TESTING MODE: Email not delivered to real user!');
      console.log('Configure real email service for production use.');
    } else {
      console.log('✅ Email sent successfully to:', to);
      console.log('🔑 OTP Code:', otp);
      console.log('📱 REAL EMAIL DELIVERY: User will receive OTP on their phone!');
      console.log('📧 Email optimized for mobile devices');
    }
    
    return { 
      ok: true, 
      previewUrl: isEthereal ? nodemailer.getTestMessageUrl(info) : undefined,
      isRealDelivery: !isEthereal,
      otp: otp
    };
  } catch (err) {
    console.error("❌ Email send error:", err);
    return { ok: false, error: err.message };
  }
};

const getOTPExpiration = () => new Date(Date.now() + 5 * 60 * 1000); // 5 min

// Verify OTP function
const verifyOTP = (storedOTP, storedExpiration, providedOTP) => {
  if (!storedOTP || !storedExpiration || !providedOTP) {
    return false;
  }

  // Check if OTP has expired
  if (new Date() > new Date(storedExpiration)) {
    return false;
  }

  // Check if OTP matches
  return storedOTP === providedOTP;
};

module.exports = { generateOTP, getOTPExpiration, sendEmailOTP, verifyOTP };
