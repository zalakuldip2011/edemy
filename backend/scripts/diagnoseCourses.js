/**
 * Diagnostic Script: Check Course and User Database Status
 * 
 * This script checks the status of courses and users in the database
 * to help diagnose why courses aren't showing in the instructor dashboard.
 * 
 * Usage: node backend/scripts/diagnoseCourses.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Models
const Course = require('../models/Course');
const User = require('../models/User');

async function diagnoseCourses() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // ===== USER ANALYSIS =====
    console.log('=' .repeat(60));
    console.log('👥 USER ANALYSIS');
    console.log('='.repeat(60));

    const allUsers = await User.find({}).select('_id username email role');
    console.log(`Total users: ${allUsers.length}\n`);

    const usersByRole = {
      student: allUsers.filter(u => u.role === 'student').length,
      instructor: allUsers.filter(u => u.role === 'instructor').length,
      admin: allUsers.filter(u => u.role === 'admin').length
    };

    console.log('Users by role:');
    console.log(`   - Students: ${usersByRole.student}`);
    console.log(`   - Instructors: ${usersByRole.instructor}`);
    console.log(`   - Admins: ${usersByRole.admin}\n`);

    const instructors = allUsers.filter(u => u.role === 'instructor');
    if (instructors.length > 0) {
      console.log('Instructor accounts:');
      instructors.forEach((instructor, index) => {
        console.log(`   ${index + 1}. ${instructor.username} (${instructor.email})`);
        console.log(`      ID: ${instructor._id}`);
      });
    } else {
      console.log('⚠️  NO INSTRUCTOR ACCOUNTS FOUND!');
      console.log('   This is likely the main issue.\n');
    }

    // ===== COURSE ANALYSIS =====
    console.log('\n' + '='.repeat(60));
    console.log('📚 COURSE ANALYSIS');
    console.log('='.repeat(60));

    const allCourses = await Course.find({}).select('_id title instructor status isPublished');
    console.log(`Total courses: ${allCourses.length}\n`);

    // Group courses by instructor field status
    const coursesWithInstructor = allCourses.filter(c => c.instructor);
    const coursesWithoutInstructor = allCourses.filter(c => !c.instructor);

    console.log('Courses by instructor field:');
    console.log(`   ✅ With instructor: ${coursesWithInstructor.length}`);
    console.log(`   ❌ Without instructor (NULL): ${coursesWithoutInstructor.length}\n`);

    // Group courses by status
    const coursesByStatus = {
      draft: allCourses.filter(c => c.status === 'draft').length,
      published: allCourses.filter(c => c.status === 'published').length,
      undefined: allCourses.filter(c => !c.status).length
    };

    console.log('Courses by status:');
    console.log(`   - Draft: ${coursesByStatus.draft}`);
    console.log(`   - Published: ${coursesByStatus.published}`);
    console.log(`   - Undefined: ${coursesByStatus.undefined}\n`);

    // Show sample courses without instructor
    if (coursesWithoutInstructor.length > 0) {
      console.log('❌ Courses WITHOUT instructor (CRITICAL ISSUE!):');
      coursesWithoutInstructor.slice(0, 10).forEach((course, index) => {
        console.log(`   ${index + 1}. "${course.title}"`);
        console.log(`      - ID: ${course._id}`);
        console.log(`      - Status: ${course.status || 'undefined'}`);
        console.log(`      - Instructor: NULL`);
      });
      if (coursesWithoutInstructor.length > 10) {
        console.log(`   ... and ${coursesWithoutInstructor.length - 10} more courses\n`);
      }
    }

    // Show instructor-course mapping
    if (coursesWithInstructor.length > 0) {
      console.log('\n✅ Courses WITH instructor:');
      
      // Group by instructor
      const coursesByInstructor = {};
      coursesWithInstructor.forEach(course => {
        const instructorId = course.instructor.toString();
        if (!coursesByInstructor[instructorId]) {
          coursesByInstructor[instructorId] = [];
        }
        coursesByInstructor[instructorId].push(course);
      });

      for (const instructorId in coursesByInstructor) {
        const instructor = instructors.find(i => i._id.toString() === instructorId);
        const courses = coursesByInstructor[instructorId];
        
        console.log(`\n   Instructor: ${instructor ? instructor.username : 'Unknown'} (ID: ${instructorId})`);
        console.log(`   Courses: ${courses.length}`);
        
        courses.slice(0, 5).forEach((course, index) => {
          console.log(`      ${index + 1}. "${course.title}" - ${course.status}`);
        });
        
        if (courses.length > 5) {
          console.log(`      ... and ${courses.length - 5} more`);
        }
      }
    }

    // ===== DIAGNOSIS =====
    console.log('\n' + '='.repeat(60));
    console.log('🔍 DIAGNOSIS');
    console.log('='.repeat(60));

    const issues = [];
    const fixes = [];

    if (instructors.length === 0) {
      issues.push('❌ NO INSTRUCTOR ACCOUNTS EXIST');
      fixes.push('   Fix: Manually change a user role to "instructor" in database or create instructor account');
    }

    if (coursesWithoutInstructor.length > 0) {
      issues.push(`❌ ${coursesWithoutInstructor.length} COURSES HAVE NO INSTRUCTOR ASSIGNED`);
      fixes.push('   Fix: Run "node backend/scripts/fixCourseInstructors.js" to assign instructor to all courses');
    }

    if (coursesWithInstructor.length > 0 && instructors.length > 0) {
      // Check if the logged-in user is the instructor
      console.log('\n✅ Some courses have instructors assigned');
      console.log('   Make sure you are logged in with one of these instructor accounts:');
      instructors.forEach(i => {
        const count = coursesByInstructor[i._id.toString()]?.length || 0;
        console.log(`      - ${i.username} (${i.email}) - ${count} courses`);
      });
    }

    if (issues.length === 0) {
      console.log('\n🎉 NO CRITICAL ISSUES FOUND!');
      console.log('   All courses have instructors assigned.');
      console.log('   If you still can\'t see courses in dashboard:');
      console.log('   1. Make sure you\'re logged in as an instructor');
      console.log('   2. Check browser console for errors');
      console.log('   3. Verify JWT token is being sent with requests');
    } else {
      console.log('\n❌ ISSUES FOUND:');
      issues.forEach(issue => console.log(issue));
      console.log('\n💡 RECOMMENDED FIXES:');
      fixes.forEach(fix => console.log(fix));
    }

    console.log('\n' + '='.repeat(60));
    
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('💥 Error during diagnosis:', error);
    process.exit(1);
  }
}

// Run the diagnostic
diagnoseCourses();
