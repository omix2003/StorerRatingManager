#!/usr/bin/env node

/**
 * Script to create test users with different roles
 * Run with: node create-test-users.js
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test users data
const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@storemanager.com',
    password: 'AdminPass123!',
    address: '123 Admin Street, Admin City, AC 12345',
    role: 'admin'
  },
  {
    name: 'Store Owner',
    email: 'owner@storemanager.com',
    password: 'OwnerPass123!',
    address: '456 Owner Avenue, Owner City, OC 67890',
    role: 'store_owner'
  },
  {
    name: 'Regular User',
    email: 'user@storemanager.com',
    password: 'UserPass123!',
    address: '789 User Boulevard, User City, UC 11111',
    role: 'user'
  }
];

async function createTestUsers() {
  console.log('🔧 Creating test users with different roles...\n');

  try {
    // Check if backend is running
    console.log('1. Checking backend server...');
    await axios.get('http://localhost:5000/health');
    console.log('✅ Backend server is running\n');

    for (let i = 0; i < testUsers.length; i++) {
      const user = testUsers[i];
      console.log(`${i + 2}. Creating ${user.role} user: ${user.name}`);
      
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, user);
        console.log(`✅ ${user.role} user created successfully`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
        console.log(`   Role: ${user.role}\n`);
      } catch (error) {
        if (error.response?.data?.message?.includes('already exists')) {
          console.log(`⚠️  ${user.role} user already exists`);
          console.log(`   Email: ${user.email}`);
          console.log(`   Password: ${user.password}`);
          console.log(`   Role: ${user.role}\n`);
        } else {
          console.log(`❌ Failed to create ${user.role} user:`, error.response?.data?.message);
          console.log('');
        }
      }
    }

    console.log('🎉 Test user creation completed!');
    console.log('\n📋 Test Credentials Summary:');
    console.log('================================');
    console.log('🔴 ADMIN USER:');
    console.log('   Email: admin@storemanager.com');
    console.log('   Password: AdminPass123!');
    console.log('   Access: Full system access, user/store management');
    console.log('');
    console.log('🔵 STORE OWNER:');
    console.log('   Email: owner@storemanager.com');
    console.log('   Password: OwnerPass123!');
    console.log('   Access: Manage own stores, view ratings');
    console.log('');
    console.log('🟢 REGULAR USER:');
    console.log('   Email: user@storemanager.com');
    console.log('   Password: UserPass123!');
    console.log('   Access: Rate stores, view store listings');
    console.log('');
    console.log('🌐 Frontend URL: http://localhost:5173');
    console.log('🔧 Backend URL: http://localhost:5000');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && npm run dev');
    }
    process.exit(1);
  }
}

// Main execution
createTestUsers();
