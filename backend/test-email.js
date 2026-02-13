require('dotenv').config();
const emailService = require('./services/emailServiceFallback');

async function testEmail() {
  console.log('Testing email configuration...');
  
  // Test connection first
  const connectionResult = await emailService.testConnection();
  if (!connectionResult.success) {
    console.log('❌ Email server connection failed:', connectionResult.error);
    return;
  }
  
  console.log('✅ Email server connection successful!');
  
  // Test sending OTP email
  const testEmail = 'mangalapurukoushik@gmail.com'; // Your email for testing
  const testOtp = '123456';
  
  console.log(`Sending test OTP ${testOtp} to ${testEmail}...`);
  const emailResult = await emailService.sendOtpEmail(testEmail, testOtp);
  
  if (emailResult.success) {
    console.log('✅ Test email sent successfully!');
    console.log('Check your email for the OTP code');
  } else {
    console.log('❌ Failed to send test email:', emailResult.error);
  }
}

testEmail();