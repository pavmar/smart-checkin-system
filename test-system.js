#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Helper function to generate unique ID (simplified version)
function generateUniqueId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SC-${year}${month}${day}-${randomNum}`;
}

async function testSystemFlow() {
  console.log('🧪 Testing Smart Check-in System Flow...\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing API Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ API is healthy:', healthResponse.data.status);
    
    // Test 2: Register a test user
    console.log('\n2. Testing User Registration...');
    const testUser = {
      uniqueId: generateUniqueId(),
      firstName: 'Test',
      lastName: 'User',
      mobile: '9876543210',
      email: 'test@example.com'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/users/register`, testUser);
    console.log('✅ User registered:', registerResponse.data.data.uniqueId);
    
    // Test 3: Get user details
    console.log('\n3. Testing Get User Details...');
    const userResponse = await axios.get(`${BASE_URL}/users/${testUser.uniqueId}`);
    console.log('✅ User found:', userResponse.data.data.firstName, userResponse.data.data.lastName);
    
    // Test 4: Check-in user
    console.log('\n4. Testing User Check-in...');
    const checkinResponse = await axios.post(`${BASE_URL}/checkin`, {
      userId: testUser.uniqueId,
      location: 'Test Location',
      notes: 'Automated test check-in'
    });
    console.log('✅ Check-in successful:', checkinResponse.data.message);
    
    // Test 5: Get check-in history
    console.log('\n5. Testing Check-in History...');
    const historyResponse = await axios.get(`${BASE_URL}/checkin/history/${testUser.uniqueId}`);
    console.log('✅ History retrieved:', historyResponse.data.data.length, 'check-ins');
    
    // Test 6: Get statistics
    console.log('\n6. Testing Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/checkin/stats`);
    console.log('✅ Statistics:', statsResponse.data.data);
    
    console.log('\n🎉 All tests passed! System is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.error('Make sure the backend server is running on port 3001');
  }
}

// Run tests
testSystemFlow();
