/**
 * Migration Script: Fix Course Instructor Field
 * 
 * This script fixes courses that don't have an instructor field assigned.
 * It will prompt you to choose an instructor user to assign to orphaned courses.
 * 
 * Usage: node backend/scripts/fixCourseInstructors.js
 */

const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

// Models
const Course = require('../models/Course');
const User = require('../models/User');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function fixCourseInstructors() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all courses
    const allCourses = await Course.find({});
    console.log(`📚 Total courses in database: ${allCourses.length}`);

    // Find courses without instructor or with null instructor
    const coursesWithoutInstructor = allCourses.filter(course => !course.instructor);
    console.log(`❌ Courses without instructor: ${coursesWithoutInstructor.length}`);

    // Find courses with instructor
    const coursesWithInstructor = allCourses.filter(course => course.instructor);
    console.log(`✅ Courses with instructor: ${coursesWithInstructor.length}\n`);

    if (coursesWithoutInstructor.length === 0) {
      console.log('🎉 All courses have instructors assigned! No migration needed.');
      process.exit(0);
    }

    // Show sample courses without instructor
    console.log('📋 Sample courses without instructor:');
    coursesWithoutInstructor.slice(0, 5).forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.title} (ID: ${course._id})`);
    });
    if (coursesWithoutInstructor.length > 5) {
      console.log(`   ... and ${coursesWithoutInstructor.length - 5} more\n`);
    } else {
      console.log('');
    }

    // Find all instructor users
    const instructors = await User.find({ role: 'instructor' }).select('_id username email role');
    
    if (instructors.length === 0) {
      console.log('⚠️  No instructor users found in database!');
      console.log('📝 Would you like to convert a user to an instructor?');
      
      const allUsers = await User.find({}).select('_id username email role');
      console.log('\n👥 Available users:');
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - Role: ${user.role}`);
      });

      const userChoice = await question('\nEnter the number of the user to make instructor (or 0 to cancel): ');
      const userIndex = parseInt(userChoice) - 1;

      if (userIndex < 0 || userIndex >= allUsers.length) {
        console.log('❌ Cancelled or invalid choice.');
        process.exit(1);
      }

      const selectedUser = allUsers[userIndex];
      selectedUser.role = 'instructor';
      await selectedUser.save();
      
      instructors.push(selectedUser);
      console.log(`✅ ${selectedUser.username} is now an instructor!\n`);
    } else {
      console.log('👨‍🏫 Available instructors:');
      instructors.forEach((instructor, index) => {
        console.log(`   ${index + 1}. ${instructor.username} (${instructor.email})`);
      });
      console.log('');
    }

    // Ask which instructor to assign
    const choice = await question(`Enter the instructor number (1-${instructors.length}) to assign to all orphaned courses: `);
    const instructorIndex = parseInt(choice) - 1;

    if (instructorIndex < 0 || instructorIndex >= instructors.length) {
      console.log('❌ Invalid choice. Exiting...');
      process.exit(1);
    }

    const selectedInstructor = instructors[instructorIndex];
    console.log(`\n📝 Assigning ${selectedInstructor.username} to ${coursesWithoutInstructor.length} courses...\n`);

    // Update all courses without instructor
    let updated = 0;
    for (const course of coursesWithoutInstructor) {
      course.instructor = selectedInstructor._id;
      await course.save();
      updated++;
      
      if (updated % 10 === 0 || updated === coursesWithoutInstructor.length) {
        console.log(`   ✅ Updated ${updated}/${coursesWithoutInstructor.length} courses...`);
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log(`✅ ${updated} courses now have instructor: ${selectedInstructor.username}`);

    // Verify the fix
    console.log('\n🔍 Verifying fix...');
    const remainingOrphans = await Course.find({ instructor: null });
    console.log(`   Courses without instructor: ${remainingOrphans.length}`);

    if (remainingOrphans.length === 0) {
      console.log('   ✅ All courses have instructors!');
    } else {
      console.log('   ⚠️  Some courses still missing instructors.');
    }

    rl.close();
    process.exit(0);

  } catch (error) {
    console.error('💥 Error during migration:', error);
    rl.close();
    process.exit(1);
  }
}

// Run the migration
fixCourseInstructors();
