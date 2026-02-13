const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOtpEmail(to, otp) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"ALA Cosmetics" <no-reply@ala-cosmetics.com>',
        to: to,
        subject: 'ALA Cosmetics - Your Verification Code',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
              .content { padding: 30px; }
              .otp-box { background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
              .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #667eea; }
              .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>ALA Cosmetics</h1>
                <p>Your Beauty Awaits</p>
              </div>
              <div class="content">
                <h2>Verification Code</h2>
                <p>Hello,</p>
                <p>Please use the following verification code to complete your login to ALA Cosmetics:</p>
                
                <div class="otp-box">
                  <div class="otp-code">${otp}</div>
                  <p style="margin-top: 10px; font-size: 14px; color: #666;">This code will expire in 5 minutes</p>
                </div>
                
                <p>If you didn't request this code, please ignore this email.</p>
                <p>For security reasons, please do not share this code with anyone.</p>
              </div>
              <div class="footer">
                <p>© 2026 ALA Cosmetics. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return { success: false, error: error.message };
    }
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email server is ready to send messages');
      return { success: true };
    } catch (error) {
      console.error('Email server connection failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();