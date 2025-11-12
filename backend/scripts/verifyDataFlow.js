/**
 * Complete Data Flow Verification Script
 * 
 * This script verifies that courses created by instructors
 * are visible in ALL the places they should appear:
 * 
 * 1. Instructor Dashboard - Stats & Recent Courses
 * 2. Instructor Courses List - All courses
 * 3. Public Course Explorer - Published courses
 * 4. Landing Page - Featured courses
 * 5. Category Pages - By category
 * 6. Search Results - Searchable
 * 
 * Usage: node backend/scripts/verifyDataFlow.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('../models/Course');
const User = require('../models/User');

async function verifyDataFlow() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    console.log('='.repeat(80));
    console.log('📊 COMPLETE DATA FLOW VERIFICATION');
    console.log('='.repeat(80));

    // 1. CHECK ALL COURSES
    console.log('\n1️⃣  ALL COURSES IN DATABASE');
    console.log('-'.repeat(80));
    const allCourses = await Course.find({});
    console.log(`Total courses: ${allCourses.length}`);
    
    const coursesWithInstructor = allCourses.filter(c => c.instructor);
    const coursesWithoutInstructor = allCourses.filter(c => !c.instructor);
    
    console.log(`   ✅ With instructor: ${coursesWithInstructor.length}`);
    console.log(`   ❌ Without instructor: ${coursesWithoutInstructor.length}`);

    if (coursesWithoutInstructor.length > 0) {
      console.log('\n   ⚠️  WARNING: Some courses have no instructor!');
      console.log('   Run: node backend/scripts/fixCourseInstructors.js');
      coursesWithoutInstructor.slice(0, 3).forEach(c => {
        console.log(`      - ${c.title}`);
      });
    }

    // 2. CHECK BY STATUS
    console.log('\n2️⃣  COURSES BY STATUS');
    console.log('-'.repeat(80));
    const published = allCourses.filter(c => c.status === 'published' || c.isPublished);
    const draft = allCourses.filter(c => c.status === 'draft' || !c.isPublished);
    
    console.log(`   📢 Published: ${published.length}`);
    console.log(`   📝 Draft: ${draft.length}`);

    // 3. CHECK INSTRUCTORS
    console.log('\n3️⃣  INSTRUCTOR ANALYSIS');
    console.log('-'.repeat(80));
    const instructors = await User.find({ role: 'instructor' });
    console.log(`Total instructors: ${instructors.length}\n`);

    if (instructors.length === 0) {
      console.log('   ❌ NO INSTRUCTORS FOUND!');
      console.log('   Create one with: node backend/scripts/makeInstructor.js <email>');
    } else {
      for (const instructor of instructors) {
        const instructorCourses = coursesWithInstructor.filter(
          c => c.instructor.toString() === instructor._id.toString()
        );
        const pubCount = instructorCourses.filter(c => c.status === 'published' || c.isPublished).length;
        const draftCount = instructorCourses.filter(c => c.status === 'draft' || !c.isPublished).length;
        
        console.log(`   👨‍🏫 ${instructor.username} (${instructor.email})`);
        console.log(`      ID: ${instructor._id}`);
        console.log(`      Total courses: ${instructorCourses.length}`);
        console.log(`      Published: ${pubCount} | Draft: ${draftCount}`);
        
        // Show sample courses
        if (instructorCourses.length > 0) {
          console.log(`      Courses:`);
          instructorCourses.slice(0, 3).forEach(c => {
            console.log(`         - "${c.title}" (${c.status || (c.isPublished ? 'published' : 'draft')})`);
          });
          if (instructorCourses.length > 3) {
            console.log(`         ... and ${instructorCourses.length - 3} more`);
          }
        }
        console.log('');
      }
    }

    // 4. CHECK VISIBILITY IN DIFFERENT PLACES
    console.log('4️⃣  VISIBILITY CHECK - Where Courses Will Appear');
    console.log('-'.repeat(80));

    // A. Instructor Dashboard
    console.log('\n   A. INSTRUCTOR DASHBOARD');
    if (instructors.length > 0) {
      for (const instructor of instructors) {
        const dashboardCourses = await Course.find({ instructor: instructor._id });
        const stats = {
          total: dashboardCourses.length,
          published: dashboardCourses.filter(c => c.status === 'published' || c.isPublished).length,
          draft: dashboardCourses.filter(c => c.status === 'draft' || !c.isPublished).length,
          enrollments: dashboardCourses.reduce((sum, c) => sum + (c.totalEnrollments || 0), 0),
          revenue: dashboardCourses.reduce((sum, c) => sum + ((c.price || 0) * (c.totalEnrollments || 0)), 0)
        };
        
        console.log(`      ${instructor.username} will see:`);
        console.log(`         Total: ${stats.total} | Published: ${stats.published} | Draft: ${stats.draft}`);
        console.log(`         Students: ${stats.enrollments} | Revenue: $${stats.revenue.toFixed(2)}`);
      }
    } else {
      console.log('      ❌ No instructors to show dashboard');
    }

    // B. Public Course Explorer
    console.log('\n   B. PUBLIC COURSE EXPLORER');
    const explorerCourses = await Course.find({ 
      $or: [
        { status: 'published' },
        { isPublished: true }
      ]
    });
    console.log(`      Visible courses: ${explorerCourses.length}`);
    if (explorerCourses.length > 0) {
      console.log(`      Sample courses:`);
      explorerCourses.slice(0, 5).forEach(c => {
        console.log(`         - ${c.title} (${c.category || 'No category'})`);
      });
      if (explorerCourses.length > 5) {
        console.log(`         ... and ${explorerCourses.length - 5} more`);
      }
    }

    // C. Featured Courses (Landing Page)
    console.log('\n   C. LANDING PAGE (Featured)');
    const featuredCourses = await Course.find({
      $or: [
        { status: 'published' },
        { isPublished: true }
      ],
      featured: true
    }).limit(8);
    console.log(`      Featured courses: ${featuredCourses.length}`);
    if (featuredCourses.length > 0) {
      featuredCourses.forEach(c => {
        console.log(`         - ${c.title}`);
      });
    } else {
      console.log(`      ⚠️  No featured courses! Mark some as featured in database.`);
    }

    // D. By Category
    console.log('\n   D. BY CATEGORY');
    const categories = {};
    explorerCourses.forEach(c => {
      if (c.category) {
        categories[c.category] = (categories[c.category] || 0) + 1;
      }
    });
    
    if (Object.keys(categories).length > 0) {
      Object.entries(categories).forEach(([category, count]) => {
        console.log(`      ${category}: ${count} courses`);
      });
    } else {
      console.log(`      ⚠️  No courses with categories assigned`);
    }

    // E. Search Test
    console.log('\n   E. SEARCH FUNCTIONALITY');
    const searchableCourses = await Course.find({
      $or: [
        { status: 'published' },
        { isPublished: true }
      ],
      $text: { $search: 'course' }
    }).limit(5);
    console.log(`      Searchable courses (sample "course"): ${searchableCourses.length}`);

    // 5. FINAL SUMMARY
    console.log('\n' + '='.repeat(80));
    console.log('📋 SUMMARY');
    console.log('='.repeat(80));

    const issues = [];
    const recommendations = [];

    if (coursesWithoutInstructor.length > 0) {
      issues.push(`❌ ${coursesWithoutInstructor.length} courses have no instructor`);
      recommendations.push('   Run: node backend/scripts/fixCourseInstructors.js');
    }

    if (instructors.length === 0) {
      issues.push('❌ No instructor accounts exist');
      recommendations.push('   Run: node backend/scripts/makeInstructor.js <email>');
    }

    if (published.length === 0 && allCourses.length > 0) {
      issues.push('❌ No published courses (all drafts)');
      recommendations.push('   Publish courses from instructor dashboard');
    }

    if (featuredCourses.length === 0) {
      issues.push('⚠️  No featured courses for landing page');
      recommendations.push('   Mark some courses as featured: db.courses.updateOne({_id: ObjectId("...")}, {$set: {featured: true}})');
    }

    if (issues.length === 0) {
      console.log('\n✅ ALL CHECKS PASSED!');
      console.log('   Your data flow is working correctly.');
      console.log('   Courses will appear in all expected locations.');
    } else {
      console.log('\n❌ ISSUES FOUND:');
      issues.forEach(issue => console.log(issue));
      console.log('\n💡 RECOMMENDATIONS:');
      recommendations.forEach(rec => console.log(rec));
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Verification complete!');
    console.log('='.repeat(80));

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('💥 Error during verification:', error);
    process.exit(1);
  }
}

verifyDataFlow();
