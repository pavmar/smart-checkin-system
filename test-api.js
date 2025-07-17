const axios = require('axios');
require('dotenv').config();

// Use environment variables for API URL
const API_HOST = process.env.EXPO_PUBLIC_API_HOST || 'localhost';
const API_PORT = process.env.EXPO_PUBLIC_API_PORT || '3001';
const API_BASE_URL = `http://${API_HOST}:${API_PORT}/api`;

async function testAPI() {
  try {
    console.log(`Testing API connection at ${API_BASE_URL}...`);
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ API Response:', response.data);
    
    // Test user registration endpoint with correct format
    console.log('\nTesting user registration endpoint...');
    const timestamp = Date.now();
    const testUser = {
      uniqueId: 'TEST-' + timestamp, // Generate unique ID like the app does
      firstName: 'Test',
      lastName: 'User',
      mobile: '555' + String(timestamp).slice(-7), // Generate unique 10-digit mobile
      email: `test${timestamp}@example.com`
    };
    
    console.log('Sending registration data:', testUser);
    const registerResponse = await axios.post(`${API_BASE_URL}/users/register`, testUser);
    console.log('✅ Registration Response:', registerResponse.data);
    
  } catch (error) {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
