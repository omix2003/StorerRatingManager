#!/usr/bin/env node

/**
 * Simple test script to verify the Store Rating Manager application
 * Run with: node test-app.js
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPass123!',
  address: '123 Test Street, Test City, TC 12345'
};

const testStore = {
  name: 'Test Store',
  email: 'store@example.com',
  address: '456 Store Avenue, Store City, SC 67890'
};

async function testAPI() {
  console.log('🧪 Testing Store Rating Manager API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test 2: User Registration
    console.log('\n2. Testing user registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
    console.log('✅ User registration successful:', registerResponse.data.data.user.name);

    // Test 3: User Login
    console.log('\n3. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    const token = loginResponse.data.data.token;
    console.log('✅ User login successful');

    // Test 4: Get Stores (should be empty initially)
    console.log('\n4. Testing get stores...');
    const storesResponse = await axios.get(`${API_BASE_URL}/stores`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get stores successful, found:', storesResponse.data.data.stores.length, 'stores');

    // Test 5: Create Store (Admin only - this might fail if user is not admin)
    console.log('\n5. Testing store creation...');
    try {
      const createStoreResponse = await axios.post(`${API_BASE_URL}/stores`, testStore, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Store creation successful:', createStoreResponse.data.data.store.name);
    } catch (error) {
      console.log('⚠️  Store creation failed (expected if user is not admin):', error.response?.data?.message);
    }

    // Test 6: Get Users (Admin only)
    console.log('\n6. Testing get users...');
    try {
      const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Get users successful, found:', usersResponse.data.data.users.length, 'users');
    } catch (error) {
      console.log('⚠️  Get users failed (expected if user is not admin):', error.response?.data?.message);
    }

    // Test 7: Get Dashboard Stats
    console.log('\n7. Testing dashboard stats...');
    try {
      const statsResponse = await axios.get(`${API_BASE_URL}/users/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Dashboard stats successful:', statsResponse.data.data);
    } catch (error) {
      console.log('⚠️  Dashboard stats failed (expected if user is not admin):', error.response?.data?.message);
    }

    console.log('\n🎉 API testing completed successfully!');
    console.log('\n📝 Notes:');
    console.log('- Some tests may fail if the user is not an admin (this is expected)');
    console.log('- The application is working correctly if you see mostly ✅ marks');
    console.log('- Check the frontend at http://localhost:5173 to test the UI');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    await axios.get('http://localhost:5000/health');
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if backend server is running...');
  
  const isBackendRunning = await checkBackend();
  if (!isBackendRunning) {
    console.error('❌ Backend server is not running!');
    console.log('Please start the backend server first:');
    console.log('cd backend && npm run dev');
    process.exit(1);
  }

  console.log('✅ Backend server is running');
  await testAPI();
}

main();
