/**
 * Course Service Layer
 * Business logic for course operations
 */

const Course = require('../models/course.model');
const { sanitizeCoursePayload, sanitizeUpdatePayload } = require('../utils/sanitize.util');
const { validateCourseReadiness } = require('../validators/course.validator');
const logger = require('../utils/logger.util');

/**
 * Create a new course
 * @param {String} instructorId - Instructor's user ID
 * @param {Object} rawPayload - Raw course data from request
 * @returns {Promise<Object>} - Created course document
 */
async function createCourse(instructorId, rawPayload = {}) {
  try {
    logger.info('Creating new course', { instructorId });
    
    // Sanitize payload to prevent null/undefined errors
    const sanitized = sanitizeCoursePayload(rawPayload);
    logger.payload(sanitized, 'Sanitized course payload');
    
    // Add instructor ID
    sanitized.instructorId = instructorId;
    
    // Set initial status
    sanitized.status = 'draft';
    sanitized.published = false;
    
    // Create course in database
    const course = await Course.create(sanitized);
    logger.db('CREATE', 'Course', { courseId: course._id, title: course.title });
    
    logger.info('✅ Course created successfully', { 
      courseId: course._id, 
      title: course.title 
    });
    
    return course;
  } catch (error) {
    logger.error('❌ Error creating course', { 
      instructorId, 
      error: error.message,
      stack: error.stack 
    });
    throw error;
  }
}

/**
 * Update an existing course
 * @param {String} courseId - Course ID
 * @param {String} instructorId - Instructor's user ID (for ownership check)
 * @param {Object} rawPayload - Raw update data
 * @returns {Promise<Object>} - Updated course document
 */
async function updateCourse(courseId, instructorId, rawPayload = {}) {
  try {
    logger.info('Updating course', { courseId, instructorId });
    
    // Find course and check ownership
    const course = await Course.findOne({ 
      _id: courseId, 
      isDeleted: false 
    });
    
    if (!course) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Check ownership
    if (course.instructorId.toString() !== instructorId) {
      const error = new Error('Unauthorized: You do not own this course');
      error.statusCode = 403;
      throw error;
    }
    
    // Sanitize update payload
    const sanitized = sanitizeUpdatePayload(rawPayload);
    logger.payload(sanitized, 'Sanitized update payload');
    
    // Don't allow direct publishing through update
    delete sanitized.published;
    delete sanitized.publishedAt;
    delete sanitized.status;
    
    // Update course
    Object.assign(course, sanitized);
    await course.save();
    
    logger.db('UPDATE', 'Course', { courseId: course._id, title: course.title });
    logger.info('✅ Course updated successfully', { 
      courseId: course._id, 
      title: course.title 
    });
    
    return course;
  } catch (error) {
    logger.error('❌ Error updating course', { 
      courseId, 
      instructorId, 
      error: error.message,
      stack: error.stack 
    });
    throw error;
  }
}

/**
 * Publish a course (with readiness checks)
 * @param {String} courseId - Course ID
 * @param {String} instructorId - Instructor's user ID
 * @returns {Promise<Object>} - Published course document
 */
async function publishCourse(courseId, instructorId) {
  try {
    logger.info('Publishing course', { courseId, instructorId });
    
    // Find course and check ownership
    const course = await Course.findOne({ 
      _id: courseId, 
      isDeleted: false 
    });
    
    if (!course) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Check ownership
    if (course.instructorId.toString() !== instructorId) {
      const error = new Error('Unauthorized: You do not own this course');
      error.statusCode = 403;
      throw error;
    }
    
    // Validate course readiness
    const validation = validateCourseReadiness(course);
    
    if (!validation.isValid) {
      logger.warn('Course not ready to publish', { 
        courseId, 
        errors: validation.errors 
      });
      
      const error = new Error('Course is not ready to publish');
      error.statusCode = 400;
      error.validationErrors = validation.errors;
      throw error;
    }
    
    // Publish the course
    course.published = true;
    course.status = 'published';
    course.publishedAt = new Date();
    
    await course.save();
    
    logger.db('PUBLISH', 'Course', { courseId: course._id, title: course.title });
    logger.info('✅ Course published successfully', { 
      courseId: course._id, 
      title: course.title,
      publishedAt: course.publishedAt
    });
    
    return course;
  } catch (error) {
    logger.error('❌ Error publishing course', { 
      courseId, 
      instructorId, 
      error: error.message,
      validationErrors: error.validationErrors,
      stack: error.stack 
    });
    throw error;
  }
}

/**
 * Unpublish a course
 * @param {String} courseId - Course ID
 * @param {String} instructorId - Instructor's user ID
 * @returns {Promise<Object>} - Unpublished course document
 */
async function unpublishCourse(courseId, instructorId) {
  try {
    logger.info('Unpublishing course', { courseId, instructorId });
    
    // Find course and check ownership
    const course = await Course.findOne({ 
      _id: courseId, 
      isDeleted: false 
    });
    
    if (!course) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Check ownership
    if (course.instructorId.toString() !== instructorId) {
      const error = new Error('Unauthorized: You do not own this course');
      error.statusCode = 403;
      throw error;
    }
    
    // Unpublish
    course.published = false;
    course.status = 'draft';
    course.publishedAt = null;
    
    await course.save();
    
    logger.db('UNPUBLISH', 'Course', { courseId: course._id });
    logger.info('✅ Course unpublished successfully', { courseId: course._id });
    
    return course;
  } catch (error) {
    logger.error('❌ Error unpublishing course', { 
      courseId, 
      instructorId, 
      error: error.message 
    });
    throw error;
  }
}

/**
 * Get courses for a specific instructor
 * @param {String} instructorId - Instructor's user ID
 * @returns {Promise<Array>} - Array of courses
 */
async function listInstructorCourses(instructorId) {
  try {
    logger.info('Listing instructor courses', { instructorId });
    
    const courses = await Course.findByInstructor(instructorId);
    
    logger.info(`✅ Found ${courses.length} courses for instructor`, { 
      instructorId, 
      count: courses.length 
    });
    
    return courses;
  } catch (error) {
    logger.error('❌ Error listing instructor courses', { 
      instructorId, 
      error: error.message 
    });
    throw error;
  }
}

/**
 * Get a single course by ID
 * @param {String} courseId - Course ID
 * @param {String} instructorId - Optional instructor ID for ownership check
 * @returns {Promise<Object>} - Course document
 */
async function getCourseById(courseId, instructorId = null) {
  try {
    logger.info('Getting course by ID', { courseId, instructorId });
    
    const query = { _id: courseId, isDeleted: false };
    
    // If instructorId provided, check ownership
    if (instructorId) {
      query.instructorId = instructorId;
    }
    
    const course = await Course.findOne(query);
    
    if (!course) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }
    
    logger.info('✅ Course found', { courseId: course._id, title: course.title });
    
    return course;
  } catch (error) {
    logger.error('❌ Error getting course', { 
      courseId, 
      error: error.message 
    });
    throw error;
  }
}

/**
 * Get all published courses (for public listing)
 * @param {Object} filters - Optional filters (category, level, etc.)
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Courses and pagination info
 */
async function getPublishedCourses(filters = {}, options = {}) {
  try {
    logger.info('Getting published courses', { filters, options });
    
    const {
      page = 1,
      limit = 12,
      sortBy = '-publishedAt'
    } = options;
    
    const query = {
      published: true,
      status: 'published',
      isDeleted: false
    };
    
    // Apply filters
    if (filters.category) query.category = filters.category;
    if (filters.level) query.level = filters.level;
    if (filters.language) query.language = filters.language;
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { tags: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    // Price filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }
    
    const skip = (page - 1) * limit;
    
    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .populate('instructorId', 'name email profile')
        .lean(),
      Course.countDocuments(query)
    ]);
    
    logger.info(`✅ Found ${courses.length} published courses`, { 
      total, 
      page, 
      limit 
    });
    
    return {
      courses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('❌ Error getting published courses', { 
      filters, 
      error: error.message 
    });
    throw error;
  }
}

/**
 * Delete a course (soft delete)
 * @param {String} courseId - Course ID
 * @param {String} instructorId - Instructor's user ID
 * @returns {Promise<Object>} - Deleted course document
 */
async function deleteCourse(courseId, instructorId) {
  try {
    logger.info('Deleting course', { courseId, instructorId });
    
    // Find course and check ownership
    const course = await Course.findOne({ 
      _id: courseId, 
      isDeleted: false 
    });
    
    if (!course) {
      const error = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Check ownership
    if (course.instructorId.toString() !== instructorId) {
      const error = new Error('Unauthorized: You do not own this course');
      error.statusCode = 403;
      throw error;
    }
    
    // Soft delete
    course.isDeleted = true;
    course.status = 'archived';
    course.published = false;
    
    await course.save();
    
    logger.db('DELETE', 'Course', { courseId: course._id });
    logger.info('✅ Course deleted successfully', { courseId: course._id });
    
    return course;
  } catch (error) {
    logger.error('❌ Error deleting course', { 
      courseId, 
      instructorId, 
      error: error.message 
    });
    throw error;
  }
}

module.exports = {
  createCourse,
  updateCourse,
  publishCourse,
  unpublishCourse,
  listInstructorCourses,
  getCourseById,
  getPublishedCourses,
  deleteCourse
};
