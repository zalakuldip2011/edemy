/**
 * Course Integration Tests
 * Tests the complete course creation and publishing flow
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Course = require('../src/courses/models/course.model');

describe('Course API Integration Tests', () => {
  
  const instructorId = new mongoose.Types.ObjectId().toString();
  let createdCourseId;
  
  // Test 1: Create course with minimal data
  describe('POST /api/courses/instructor - Create Course', () => {
    
    it('should create a course with minimal required fields', async () => {
      const response = await request(app)
        .post('/api/courses/instructor')
        .send({
          instructorId,
          title: 'DSA in Java',
          subtitle: 'Introduction to Data Structures',
          description: 'Complete course on data structures and algorithms using Java'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.course).toBeDefined();
      expect(response.body.course.title).toBe('DSA in Java');
      expect(response.body.course.sections).toEqual([]);
      expect(response.body.course.learningOutcomes).toEqual([]);
      expect(response.body.course.features).toBeDefined();
      expect(response.body.course.status).toBe('draft');
      expect(response.body.course.published).toBe(false);
      
      createdCourseId = response.body.course._id;
    });
    
    it('should create a course with partial payload and return safe defaults', async () => {
      const response = await request(app)
        .post('/api/courses/instructor')
        .send({
          instructorId,
          title: 'Web Development Bootcamp',
          price: 49.99
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.course.sections).toEqual([]);
      expect(response.body.course.features).toEqual({
        enableCertificate: true,
        enableQA: true,
        enableReviews: true,
        enableDownloads: false,
        enableDiscussions: true
      });
      expect(response.body.course.promo).toEqual({
        enabled: false,
        discountPercentage: 0,
        startDate: null,
        endDate: null
      });
    });
    
    it('should fail to create course without title', async () => {
      const response = await request(app)
        .post('/api/courses/instructor')
        .send({
          instructorId,
          description: 'Test course'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });
    
    it('should fail without instructor ID', async () => {
      const response = await request(app)
        .post('/api/courses/instructor')
        .send({
          title: 'Test Course'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
    
  });
  
  // Test 2: Update course
  describe('PUT /api/courses/:id - Update Course', () => {
    
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/courses/instructor')
        .send({
          instructorId,
          title: 'Original Title',
          description: 'Original description'
        });
      createdCourseId = response.body.course._id;
    });
    
    it('should update course with new data', async () => {
      const updateData = {
        instructorId,
        title: 'Updated Title',
        learningOutcomes: ['Outcome 1', 'Outcome 2', 'Outcome 3', 'Outcome 4'],
        sections: [
          {
            title: 'Introduction',
            lectures: [
              { title: 'Welcome', duration: 300 }
            ]
          }
        ]
      };
      
      const response = await request(app)
        .put(`/api/courses/${createdCourseId}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.course.title).toBe('Updated Title');
      expect(response.body.course.learningOutcomes).toHaveLength(4);
      expect(response.body.course.sections).toHaveLength(1);
    });
    
    it('should fail to update non-existent course', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .put(`/api/courses/${fakeId}`)
        .send({
          instructorId,
          title: 'Updated Title'
        });
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
    
    it('should fail to update course with wrong instructor', async () => {
      const wrongInstructorId = new mongoose.Types.ObjectId().toString();
      
      const response = await request(app)
        .put(`/api/courses/${createdCourseId}`)
        .send({
          instructorId: wrongInstructorId,
          title: 'Updated Title'
        });
      
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
    
  });
  
  // Test 3: Publish course (with readiness checks)
  describe('PATCH /api/courses/:id/publish - Publish Course', () => {
    
    it('should fail to publish incomplete course', async () => {
      // Create minimal course
      const createResponse = await request(app)
        .post('/api/courses/instructor')
        .send({
          instructorId,
          title: 'Incomplete Course',
          description: 'Short'
        });
      
      const courseId = createResponse.body.course._id;
      
      // Try to publish
      const response = await request(app)
        .patch(`/api/courses/${courseId}/publish`)
        .send({ instructorId });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not ready');
      expect(response.body.errors).toBeDefined();
      expect(response.body.missing).toBeDefined();
    });
    
    it('should successfully publish ready course', async () => {
      // Create complete course
      const createResponse = await request(app)
        .post('/api/courses/instructor')
        .send({
          instructorId,
          title: 'Complete Course',
          description: 'This is a complete course description with enough content',
          category: 'Web Development',
          thumbnailUrl: 'https://example.com/thumb.jpg',
          learningOutcomes: [
            'Learn JavaScript',
            'Learn React',
            'Build Projects',
            'Deploy Applications'
          ],
          sections: [
            {
              title: 'Getting Started',
              lectures: [
                { 
                  title: 'Introduction',
                  duration: 300,
                  type: 'video'
                }
              ]
            }
          ]
        });
      
      const courseId = createResponse.body.course._id;
      
      // Publish course
      const response = await request(app)
        .patch(`/api/courses/${courseId}/publish`)
        .send({ instructorId });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.course.published).toBe(true);
      expect(response.body.course.status).toBe('published');
      expect(response.body.course.publishedAt).toBeDefined();
    });
    
  });
  
  // Test 4: List instructor courses
  describe('GET /api/courses/instructor - List Instructor Courses', () => {
    
    beforeEach(async () => {
      // Create multiple courses
      await request(app)
        .post('/api/courses/instructor')
        .send({
          instructorId,
          title: 'Course 1',
          description: 'First course'
        });
      
      await request(app)
        .post('/api/courses/instructor')
        .send({
          instructorId,
          title: 'Course 2',
          description: 'Second course'
        });
    });
    
    it('should list all courses for instructor', async () => {
      const response = await request(app)
        .get('/api/courses/instructor')
        .query({ instructorId });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.courses).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
    
    it('should fail without instructor ID', async () => {
      const response = await request(app)
        .get('/api/courses/instructor');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
    
  });
  
  // Test 5: Get published courses (public)
  describe('GET /api/courses/public - Get Published Courses', () => {
    
    beforeEach(async () => {
      // Create and publish a course
      const course = await Course.create({
        instructorId,
        title: 'Published Course',
        description: 'This is a published course with complete content',
        category: 'Web Development',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        learningOutcomes: ['A', 'B', 'C', 'D'],
        sections: [{
          title: 'Intro',
          lectures: [{ title: 'Lesson 1' }]
        }],
        published: true,
        status: 'published',
        publishedAt: new Date()
      });
      
      // Create a draft (should not appear)
      await Course.create({
        instructorId,
        title: 'Draft Course',
        description: 'Draft',
        published: false,
        status: 'draft'
      });
    });
    
    it('should return only published courses', async () => {
      const response = await request(app)
        .get('/api/courses/public');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.courses).toHaveLength(1);
      expect(response.body.courses[0].published).toBe(true);
    });
    
    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/courses/public')
        .query({ page: 1, limit: 10 });
      
      expect(response.status).toBe(200);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });
    
  });
  
  // Test 6: Complete workflow
  describe('Complete Course Creation & Publishing Workflow', () => {
    
    it('should complete full workflow: create → update → publish', async () => {
      // Step 1: Create draft
      const createRes = await request(app)
        .post('/api/courses/instructor')
        .send({
          instructorId,
          title: 'Full Workflow Course',
          description: 'Testing complete workflow'
        });
      
      expect(createRes.status).toBe(201);
      const courseId = createRes.body.course._id;
      
      // Step 2: Update with content
      const updateRes = await request(app)
        .put(`/api/courses/${courseId}`)
        .send({
          instructorId,
          category: 'Programming Languages',
          thumbnailUrl: 'https://example.com/thumb.jpg',
          learningOutcomes: [
            'Master Python basics',
            'Build real projects',
            'Understand OOP',
            'Work with APIs'
          ],
          sections: [
            {
              title: 'Python Basics',
              lectures: [
                { title: 'Variables and Data Types', duration: 600 },
                { title: 'Control Flow', duration: 900 }
              ]
            },
            {
              title: 'Advanced Topics',
              lectures: [
                { title: 'OOP Concepts', duration: 1200 }
              ]
            }
          ]
        });
      
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.course.learningOutcomes).toHaveLength(4);
      expect(updateRes.body.course.sections).toHaveLength(2);
      
      // Step 3: Publish
      const publishRes = await request(app)
        .patch(`/api/courses/${courseId}/publish`)
        .send({ instructorId });
      
      expect(publishRes.status).toBe(200);
      expect(publishRes.body.course.published).toBe(true);
      expect(publishRes.body.course.status).toBe('published');
      
      // Step 4: Verify in public listing
      const publicRes = await request(app)
        .get('/api/courses/public');
      
      expect(publicRes.status).toBe(200);
      const publishedCourse = publicRes.body.courses.find(c => c._id === courseId);
      expect(publishedCourse).toBeDefined();
      expect(publishedCourse.published).toBe(true);
    });
    
  });
  
  // Test 7: Delete course
  describe('DELETE /api/courses/:id - Delete Course', () => {
    
    it('should soft delete a course', async () => {
      const createRes = await request(app)
        .post('/api/courses/instructor')
        .send({
          instructorId,
          title: 'Course to Delete',
          description: 'This will be deleted'
        });
      
      const courseId = createRes.body.course._id;
      
      const deleteRes = await request(app)
        .delete(`/api/courses/${courseId}`)
        .send({ instructorId });
      
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);
      
      // Verify course is soft deleted
      const course = await Course.findById(courseId);
      expect(course.isDeleted).toBe(true);
    });
    
  });
  
});
