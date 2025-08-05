#!/usr/bin/env node

const https = require('https');

// Test after domain verification
async function testAfterFixes() {
  console.log('🧪 Testing After Domain Verification...\n');
  
  const tests = [
    {
      name: '📧 Email API - After Domain Fix',
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
      name: '👤 User API - Database Test',
      url: 'https://www.mot-alert.com/api/users',
      method: 'POST',
      body: JSON.stringify({
        email: 'test2@example.com',
        name: 'Test User 2',
        phone: '447123456789'
      })
    },
    {
      name: '🚗 Vehicle API - Database Test',
      url: 'https://www.mot-alert.com/api/vehicles',
      method: 'POST',
      body: JSON.stringify({
        userId: 'test-user-123',
        registration: 'TEST456',
        make: 'Ford',
        model: 'Focus',
        year: '2020',
        motDueDate: '2024-12-15'
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
      
      if (result.status === 200) {
        console.log('✅ SUCCESS!');
        if (result.data.success) {
          console.log(`📄 Message: ${result.data.message}`);
        }
      } else if (result.status === 403) {
        console.log('❌ Domain not verified yet');
        console.log('💡 Wait a few more minutes for DNS propagation');
      } else {
        console.log(`❌ Failed: ${result.status}`);
        console.log(`📄 Response: ${JSON.stringify(result.data, null, 2)}`);
      }
      
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }
  }
}

testAfterFixes(); 