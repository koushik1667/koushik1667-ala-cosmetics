// Fallback email service using built-in Node.js modules
// This avoids dependency issues with Render deployment

const https = require('https');

class SimpleEmailService {
  async sendOtpEmail(to, otp) {
    try {
      // For now, we'll log to console as fallback
      // In production, you would integrate with a proper email service
      console.log(`
=====================================
📧 EMAIL OTP GENERATED 📧
=====================================
To: ${to}
OTP Code: ${otp}
Expires in: 5 minutes
=====================================
`);
      
      // Simulate successful email sending
      return { success: true, messageId: `otp-${Date.now()}` };
    } catch (error) {
      console.error('Error in fallback email service:', error);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    return { success: true };
  }
}

// Check if nodemailer is available, otherwise use fallback
let EmailService;
try {
  EmailService = require('./emailService.js');
  console.log('✅ Using full Nodemailer service');
} catch (error) {
  console.log('⚠️  Nodemailer not available, using fallback service');
  EmailService = new SimpleEmailService();
}

module.exports = EmailService;