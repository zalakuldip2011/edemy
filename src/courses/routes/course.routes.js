/**
 * Course Routes
 * Defines all course-related endpoints
 */

const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course.controller');
const {
  createCourseValidator,
  updateCourseValidator,
  publishCourseValidator,
  getCourseByIdValidator,
  deleteCourseValidator
} = require('../validators/course.validator');

// Note: Authentication middleware should be added here in production
// const { authenticate, requireRole } = require('../../middleware/auth');

/**
 * @route   POST /api/courses/instructor
 * @desc    Create a new course
 * @access  Private (Instructor only)
 */
router.post(
  '/instructor',
  // authenticate, // Add auth middleware
  // requireRole('instructor'),
  createCourseValidator,
  courseController.createCourseHandler
);

/**
 * @route   GET /api/courses/instructor
 * @desc    Get all courses for logged-in instructor
 * @access  Private (Instructor only)
 */
router.get(
  '/instructor',
  // authenticate,
  // requireRole('instructor'),
  courseController.listInstructorCoursesHandler
);

/**
 * @route   GET /api/courses/public
 * @desc    Get all published courses (public listing)
 * @access  Public
 */
router.get(
  '/public',
  courseController.getPublishedCoursesHandler
);

/**
 * @route   GET /api/courses/:id
 * @desc    Get a single course by ID
 * @access  Public for published, Private for drafts
 */
router.get(
  '/:id',
  getCourseByIdValidator,
  courseController.getCourseByIdHandler
);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update a course
 * @access  Private (Course owner only)
 */
router.put(
  '/:id',
  // authenticate,
  // requireRole('instructor'),
  updateCourseValidator,
  courseController.updateCourseHandler
);

/**
 * @route   PATCH /api/courses/:id/publish
 * @desc    Publish a course
 * @access  Private (Course owner only)
 */
router.patch(
  '/:id/publish',
  // authenticate,
  // requireRole('instructor'),
  publishCourseValidator,
  courseController.publishCourseHandler
);

/**
 * @route   PATCH /api/courses/:id/unpublish
 * @desc    Unpublish a course
 * @access  Private (Course owner only)
 */
router.patch(
  '/:id/unpublish',
  // authenticate,
  // requireRole('instructor'),
  publishCourseValidator,
  courseController.unpublishCourseHandler
);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course (soft delete)
 * @access  Private (Course owner only)
 */
router.delete(
  '/:id',
  // authenticate,
  // requireRole('instructor'),
  deleteCourseValidator,
  courseController.deleteCourseHandler
);

module.exports = router;
