#!/usr/bin/env node

const https = require('https');

// Simple test to check if APIs are responding
async function testBasicConnectivity() {
  console.log('🔍 Testing Basic API Connectivity...\n');
  
  const tests = [
    {
      name: '📧 Email API - Basic Test',
      url: 'https://www.mot-alert.com/api/email',
      method: 'POST',
      body: JSON.stringify({
        to: 'test@example.com',
        userName: 'Test User',
        type: 'twoWeeks',
        vehicleReg: 'TEST123',
        dueDate: '2024-12-15'
      })
    },
    {
      name: '📱 SMS API - Basic Test', 
      url: 'https://www.mot-alert.com/api/sms',
      method: 'POST',
      body: JSON.stringify({
        phoneNumber: '447123456789',
        type: 'twoWeeks',
        vehicleReg: 'TEST123',
        dueDate: '2024-12-15'
      })
    },
    {
      name: '👤 User API - Basic Test',
      url: 'https://www.mot-alert.com/api/users',
      method: 'POST', 
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        phone: '447123456789'
      })
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n🔍 Testing: ${test.name}`);
      
      const result = await new Promise((resolve, reject) => {
        const req = https.request(test.url, {
          method: test.method,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'MOT-Alert-Test/1.0'
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const jsonData = JSON.parse(data);
              resolve({ status: res.statusCode, data: jsonData });
            } catch (e) {
              resolve({ status: res.statusCode, data: data });
            }
          });
        });

        req.on('error', reject);
        req.write(test.body);
        req.end();
      });

      console.log(`📊 Status: ${result.status}`);
      console.log(`📄 Response: ${JSON.stringify(result.data, null, 2)}`);
      
      if (result.status === 200) {
        console.log('✅ API is responding correctly');
      } else if (result.status === 500) {
        console.log('❌ Server error - check Vercel logs');
      } else {
        console.log(`⚠️ Unexpected status: ${result.status}`);
      }
      
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }
  }
}

testBasicConnectivity(); 