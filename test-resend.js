#!/usr/bin/env node

const { Resend } = require('resend');

// Test Resend configuration
async function testResend() {
  console.log('🧪 Testing Resend Configuration...\n');
  
  // Check if API key is available
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log('❌ RESEND_API_KEY not found in environment variables');
    console.log('💡 Add it to your Vercel environment variables');
    return;
  }
  
  console.log(`✅ RESEND_API_KEY found: ${apiKey.substring(0, 10)}...`);
  
  try {
    const resend = new Resend(apiKey);
    
    // Test sending a simple email
    console.log('📧 Testing email send...');
    
    const result = await resend.emails.send({
      from: 'MOT Alert <noreply@mot-alert.com>',
      to: ['test@example.com'],
      subject: 'Test Email from MOT Alert',
      html: '<p>This is a test email to verify Resend configuration.</p>'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('📄 Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.log('❌ Resend Error:', error.message);
    
    if (error.message.includes('domain')) {
      console.log('💡 You need to verify your domain in Resend dashboard');
      console.log('   Go to: https://resend.com/domains');
    }
    
    if (error.message.includes('API key')) {
      console.log('💡 Check your Resend API key is correct');
      console.log('   Go to: https://resend.com/api-keys');
    }
  }
}

testResend(); 