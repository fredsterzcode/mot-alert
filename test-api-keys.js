#!/usr/bin/env node

const https = require('https');

// Test API key creation (without auth for testing)
async function testApiKeyCreation() {
  console.log('🔑 Testing API Key Creation...\n');
  
  const testData = {
    email: 'test@example.com',
    name: 'Test API Key'
  };
  
  try {
    console.log('📤 Creating test API key...');
    
    const result = await new Promise((resolve, reject) => {
      const req = https.request('https://www.mot-alert.com/api/keys', {
        method: 'POST',
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
      req.write(JSON.stringify(testData));
      req.end();
    });

    console.log(`📊 Status: ${result.status}`);
    console.log(`📄 Response: ${JSON.stringify(result.data, null, 2)}`);
    
    if (result.status === 200) {
      console.log('✅ API Key created successfully!');
      return result.data.apiKey?.key;
    } else if (result.status === 401) {
      console.log('⏳ Authentication required - this is expected');
      return null;
    } else {
      console.log('❌ API Key creation failed');
      return null;
    }
    
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
    return null;
  }
}

// Test Public API with API key
async function testPublicAPI(apiKey) {
  console.log('\n🌐 Testing Public API...\n');
  
  if (!apiKey) {
    console.log('⚠️ No API key available - testing with invalid key');
    apiKey = 'invalid-key';
  }
  
  try {
    console.log('📤 Making API request...');
    
    const result = await new Promise((resolve, reject) => {
      const req = https.request('https://www.mot-alert.com/api/v1/vehicle?registration=TEST123', {
        method: 'GET',
        headers: {
          'X-API-Key': apiKey,
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
      req.end();
    });

    console.log(`📊 Status: ${result.status}`);
    console.log(`📄 Response: ${JSON.stringify(result.data, null, 2)}`);
    
    if (result.status === 200) {
      console.log('✅ Public API is working perfectly!');
    } else if (result.status === 401) {
      console.log('⏳ Invalid API key - this is expected');
    } else if (result.status === 429) {
      console.log('⏳ Rate limit exceeded - this is expected');
    } else {
      console.log('❌ Public API has issues');
    }
    
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  const apiKey = await testApiKeyCreation();
  await testPublicAPI(apiKey);
  
  console.log('\n✨ Tests completed!');
}

runTests(); 