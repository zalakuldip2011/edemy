const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  getEnrollment,
  updateProgress
} = require('../controllers/enrollmentController');
const { auth, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

/**
 * @route   POST /api/enrollments
 * @desc    Enroll in a course
 * @access  Private (Student)
 */
router.post('/', requireRole('student'), enrollCourse);

/**
 * @route   GET /api/enrollments
 * @desc    Get all my enrollments
 * @access  Private (Student)
 */
router.get('/', requireRole('student'), getMyEnrollments);

/**
 * @route   GET /api/enrollments/:enrollmentId
 * @desc    Get a specific enrollment
 * @access  Private (Student)
 */
router.get('/:enrollmentId', requireRole('student'), getEnrollment);

/**
 * @route   PUT /api/enrollments/:enrollmentId/progress
 * @desc    Update progress (mark lecture complete)
 * @access  Private (Student)
 */
router.put('/:enrollmentId/progress', requireRole('student'), updateProgress);

module.exports = router;
