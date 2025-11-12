/**
 * Quick Script: Make User an Instructor
 * 
 * This script quickly converts a user to an instructor role.
 * Usage: node backend/scripts/makeInstructor.js <email_or_username>
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function makeInstructor() {
  try {
    const identifier = process.argv[2];

    if (!identifier) {
      console.log('❌ Please provide email or username');
      console.log('Usage: node backend/scripts/makeInstructor.js <email_or_username>');
      console.log('Example: node backend/scripts/makeInstructor.js john@example.com');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier }
      ]
    });

    if (!user) {
      console.log(`❌ User not found: ${identifier}`);
      console.log('\nAvailable users:');
      
      const allUsers = await User.find({}).select('username email role').limit(10);
      allUsers.forEach(u => {
        console.log(`   - ${u.username} (${u.email}) - ${u.role}`);
      });
      
      process.exit(1);
    }

    console.log('👤 Found user:');
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Current Role: ${user.role}\n`);

    if (user.role === 'instructor') {
      console.log('✅ User is already an instructor!');
      process.exit(0);
    }

    // Update role
    user.role = 'instructor';
    await user.save();

    console.log('🎉 Successfully updated!');
    console.log(`   ${user.username} is now an INSTRUCTOR\n`);

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('💥 Error:', error.message);
    process.exit(1);
  }
}

makeInstructor();
