/**
 * Course Controller
 * Handles HTTP requests and responses for course operations
 */

const courseService = require('../services/course.service');
const logger = require('../utils/logger.util');

/**
 * Create a new course
 * POST /api/courses/instructor
 */
async function createCourseHandler(req, res) {
  try {
    logger.request(req, '📝 Creating new course');
    
    // Get instructor ID from authenticated user or request body (for testing)
    const instructorId = req.user?.id || req.user?._id || req.body.instructorId;
    
    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Instructor ID required'
      });
    }
    
    // Create course
    const course = await courseService.createCourse(instructorId, req.body);
    
    // Return created course
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
    
  } catch (error) {
    logger.error('❌ Error in createCourseHandler', { 
      error: error.message,
      stack: error.stack
    });
    
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error creating course',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Update an existing course
 * PUT /api/courses/:id
 */
async function updateCourseHandler(req, res) {
  try {
    logger.request(req, '✏️ Updating course');
    
    const { id } = req.params;
    const instructorId = req.user?.id || req.user?._id || req.body.instructorId;
    
    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Instructor ID required'
      });
    }
    
    // Update course
    const course = await courseService.updateCourse(id, instructorId, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
    
  } catch (error) {
    logger.error('❌ Error in updateCourseHandler', { 
      courseId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error updating course',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Publish a course
 * PATCH /api/courses/:id/publish
 */
async function publishCourseHandler(req, res) {
  try {
    logger.request(req, '🚀 Publishing course');
    
    const { id } = req.params;
    const instructorId = req.user?.id || req.user?._id || req.body.instructorId;
    
    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Instructor ID required'
      });
    }
    
    // Publish course
    const course = await courseService.publishCourse(id, instructorId);
    
    res.status(200).json({
      success: true,
      message: 'Course published successfully',
      course
    });
    
  } catch (error) {
    logger.error('❌ Error in publishCourseHandler', { 
      courseId: req.params.id,
      error: error.message,
      validationErrors: error.validationErrors,
      stack: error.stack
    });
    
    const statusCode = error.statusCode || 500;
    
    // Return validation errors if course not ready
    if (error.validationErrors) {
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        missing: error.validationErrors.map(e => e.field),
        errors: error.validationErrors
      });
    }
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error publishing course',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Unpublish a course
 * PATCH /api/courses/:id/unpublish
 */
async function unpublishCourseHandler(req, res) {
  try {
    logger.request(req, '📦 Unpublishing course');
    
    const { id } = req.params;
    const instructorId = req.user?.id || req.user?._id || req.body.instructorId;
    
    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Instructor ID required'
      });
    }
    
    // Unpublish course
    const course = await courseService.unpublishCourse(id, instructorId);
    
    res.status(200).json({
      success: true,
      message: 'Course unpublished successfully',
      course
    });
    
  } catch (error) {
    logger.error('❌ Error in unpublishCourseHandler', { 
      courseId: req.params.id,
      error: error.message
    });
    
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error unpublishing course',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Get courses for logged-in instructor
 * GET /api/courses/instructor
 */
async function listInstructorCoursesHandler(req, res) {
  try {
    logger.request(req, '📚 Listing instructor courses');
    
    const instructorId = req.user?.id || req.user?._id || req.query.instructorId;
    
    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Instructor ID required'
      });
    }
    
    // Get courses
    const courses = await courseService.listInstructorCourses(instructorId);
    
    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
    
  } catch (error) {
    logger.error('❌ Error in listInstructorCoursesHandler', { 
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching courses',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Get a single course by ID
 * GET /api/courses/:id
 */
async function getCourseByIdHandler(req, res) {
  try {
    logger.request(req, '🔍 Getting course by ID');
    
    const { id } = req.params;
    const instructorId = req.user?.id || req.user?._id;
    
    // Get course (with optional ownership check)
    const course = await courseService.getCourseById(id, instructorId);
    
    res.status(200).json({
      success: true,
      course
    });
    
  } catch (error) {
    logger.error('❌ Error in getCourseByIdHandler', { 
      courseId: req.params.id,
      error: error.message
    });
    
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error fetching course',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Get all published courses (public)
 * GET /api/courses/public
 */
async function getPublishedCoursesHandler(req, res) {
  try {
    logger.request(req, '🌍 Getting published courses');
    
    // Parse filters from query params
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.level) filters.level = req.query.level;
    if (req.query.language) filters.language = req.query.language;
    if (req.query.search) filters.search = req.query.search;
    if (req.query.tags) filters.tags = req.query.tags.split(',');
    if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice);
    
    // Parse pagination options
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 12,
      sortBy: req.query.sortBy || '-publishedAt'
    };
    
    // Get courses
    const result = await courseService.getPublishedCourses(filters, options);
    
    res.status(200).json({
      success: true,
      ...result
    });
    
  } catch (error) {
    logger.error('❌ Error in getPublishedCoursesHandler', { 
      error: error.message
    });
    
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching published courses',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Delete a course (soft delete)
 * DELETE /api/courses/:id
 */
async function deleteCourseHandler(req, res) {
  try {
    logger.request(req, '🗑️ Deleting course');
    
    const { id } = req.params;
    const instructorId = req.user?.id || req.user?._id || req.body.instructorId;
    
    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Instructor ID required'
      });
    }
    
    // Delete course
    const course = await courseService.deleteCourse(id, instructorId);
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      course
    });
    
  } catch (error) {
    logger.error('❌ Error in deleteCourseHandler', { 
      courseId: req.params.id,
      error: error.message
    });
    
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error deleting course',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

module.exports = {
  createCourseHandler,
  updateCourseHandler,
  publishCourseHandler,
  unpublishCourseHandler,
  listInstructorCoursesHandler,
  getCourseByIdHandler,
  getPublishedCoursesHandler,
  deleteCourseHandler
};
