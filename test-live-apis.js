#!/usr/bin/env node

/**
 * Live API Testing Script
 * 
 * This script tests all your APIs on the live Vercel deployment.
 * Replace YOUR_VERCEL_URL with your actual Vercel domain.
 */

const https = require('https');

// Update this to your actual Vercel URL
const BASE_URL = 'https://www.mot-alert.com';

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testAPIs() {
  console.log('🧪 Testing Live APIs at:', BASE_URL);
  console.log('─'.repeat(50));

  const tests = [
    {
      name: '📧 Email API Test',
      url: `${BASE_URL}/api/email`,
      method: 'POST',
      body: JSON.stringify({
        to: 'test@example.com',
        userName: 'John',
        type: 'twoWeeks',
        vehicleReg: 'AB12 CDE',
        dueDate: '2024-12-15'
      }),
      headers: { 'Content-Type': 'application/json' }
    },
    {
      name: '📱 SMS API Test',
      url: `${BASE_URL}/api/sms`,
      method: 'POST',
      body: JSON.stringify({
        phoneNumber: '447123456789',
        type: 'twoWeeks',
        vehicleReg: 'AB12 CDE',
        dueDate: '2024-12-15'
      }),
      headers: { 'Content-Type': 'application/json' }
    },
    {
      name: '🚗 Vehicle API Test',
      url: `${BASE_URL}/api/vehicles`,
      method: 'POST',
      body: JSON.stringify({
        userId: 'test-user-123',
        registration: 'AB12 CDE',
        make: 'Ford',
        model: 'Focus',
        year: '2019',
        motDueDate: '2024-12-15'
      }),
      headers: { 'Content-Type': 'application/json' }
    },
    {
      name: '👤 User API Test',
      url: `${BASE_URL}/api/users`,
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'John Doe',
        phone: '447123456789'
      }),
      headers: { 'Content-Type': 'application/json' }
    },
    {
      name: '💳 Subscription API Test',
      url: `${BASE_URL}/api/subscriptions/create`,
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'John Doe',
        planType: 'premium'
      }),
      headers: { 'Content-Type': 'application/json' }
    },
    {
      name: '🔍 Public API Test',
      url: `${BASE_URL}/api/v1/vehicle?registration=AB12CDE&api_key=test_key`,
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n🔍 Testing: ${test.name}`);
      
      const options = {
        method: test.method,
        headers: test.headers || {}
      };

      const result = await makeRequest(test.url, options);
      
      if (result.status === 200) {
        console.log(`✅ Success (${result.status})`);
        console.log(`📄 Response:`, JSON.stringify(result.data, null, 2));
      } else {
        console.log(`❌ Failed (${result.status})`);
        console.log(`📄 Response:`, JSON.stringify(result.data, null, 2));
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log('\n🎯 Testing Complete!');
  console.log('\n📋 Manual Test Commands:');
  console.log('─'.repeat(50));
  
  tests.forEach(test => {
    const curlCommand = `curl -X ${test.method} ${test.url}`;
    if (test.body) {
      console.log(`${curlCommand} \\`);
      console.log(`  -H "Content-Type: application/json" \\`);
      console.log(`  -d '${test.body}'`);
    } else {
      console.log(curlCommand);
    }
    console.log('');
  });
}

testAPIs().catch(console.error); 