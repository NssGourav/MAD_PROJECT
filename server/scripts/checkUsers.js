/**
 * Script to check users in MongoDB
 * Run with: node scripts/checkUsers.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shuttle_tracker';

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users (without password)
    const users = await User.find().select('-password');
    
    console.log(`📊 Total Users: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('No users found in database.');
    } else {
      console.log('👥 Users in Database:');
      console.log('─'.repeat(80));
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User ID: ${user._id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Created: ${user.createdAt}`);
      });
      console.log('\n' + '─'.repeat(80));
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();

