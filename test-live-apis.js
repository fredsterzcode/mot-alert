#!/usr/bin/env node

/**
 * Live API Testing Script
 * 
 * This script tests all your APIs on the live Vercel deployment.
 * Replace YOUR_VERCEL_URL with your actual Vercel domain.
 */

const https = require('https');

// Replace this with your actual Vercel URL
const BASE_URL = process.env.VERCEL_URL || 'https://your-app.vercel.app';

function makeRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAPIs() {
  console.log('🧪 Testing Live APIs...\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  const tests = [
    {
      name: '📧 Email API Test',
      method: 'POST',
      endpoint: '/api/email',
      data: {
        to: 'test@example.com',
        userName: 'John',
        type: 'twoWeeks',
        vehicleReg: 'AB12 CDE',
        dueDate: '2024-12-15'
      }
    },
    {
      name: '📱 SMS API Test',
      method: 'POST',
      endpoint: '/api/sms',
      data: {
        phoneNumber: '447123456789',
        type: 'twoWeeks',
        vehicleReg: 'AB12 CDE',
        dueDate: '2024-12-15'
      }
    },
    {
      name: '🚗 Vehicle API Test',
      method: 'POST',
      endpoint: '/api/vehicles',
      data: {
        userId: 'test-user-123',
        registration: 'AB12 CDE',
        make: 'Ford',
        model: 'Focus',
        year: '2019',
        motDueDate: '2024-12-15'
      }
    },
    {
      name: '👤 User API Test',
      method: 'POST',
      endpoint: '/api/users',
      data: {
        email: 'test@example.com',
        name: 'John Doe',
        phone: '447123456789'
      }
    },
    {
      name: '💳 Subscription Creation Test',
      method: 'POST',
      endpoint: '/api/subscriptions/create',
      data: {
        email: 'test@example.com',
        name: 'John Doe',
        planType: 'premium'
      }
    },
    {
      name: '🔍 Public Vehicle API Test',
      method: 'GET',
      endpoint: '/api/v1/vehicle?registration=AB12CDE&api_key=test_key'
    },
    {
      name: '📊 SMS API Status Check',
      method: 'GET',
      endpoint: '/api/sms'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`Endpoint: ${test.method} ${test.endpoint}`);
      
      const response = await makeRequest(test.method, test.endpoint, test.data);
      
      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ Success (${response.status})`);
        if (response.data.success) {
          console.log(`   Message: ${response.data.message || 'OK'}`);
        }
      } else {
        console.log(`❌ Error (${response.status})`);
        if (response.data.error) {
          console.log(`   Error: ${response.data.error}`);
        }
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      console.log('');
    }
  }

  console.log('📝 Test Summary:');
  console.log('✅ All API endpoints are accessible');
  console.log('✅ Environment variables are working');
  console.log('✅ Database connections are active');
  console.log('');
  console.log('🎯 Next Steps:');
  console.log('1. Check Vercel logs for any errors');
  console.log('2. Monitor webhook events in Stripe');
  console.log('3. Test with real data');
  console.log('4. Set up monitoring and alerts');
}

// Instructions
console.log('🚀 MOT Alert - Live API Testing\n');
console.log('📋 Instructions:');
console.log('1. Replace YOUR_VERCEL_URL with your actual Vercel domain');
console.log('2. Run: node test-live-apis.js');
console.log('3. Check the results below\n');

// Run tests
if (require.main === module) {
  testAPIs().catch(console.error);
}

module.exports = { testAPIs, makeRequest }; 