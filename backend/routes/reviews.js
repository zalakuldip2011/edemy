const express = require('express');
const router = express.Router();
const {
  createReview,
  getCourseReviews,
  getReview,
  getMyReview,
  updateReview,
  deleteReview,
  markHelpful,
  flagReview,
  addInstructorResponse,
  updateInstructorResponse,
  deleteInstructorResponse,
  moderateReview,
  getFlaggedReviews,
  getInstructorReviews
} = require('../controllers/reviewController');
const { auth, requireRole } = require('../middleware/auth');

/**
 * @route   POST /api/reviews
 * @desc    Create a review for a course
 * @access  Private (Student - must be enrolled)
 */
router.post('/', auth, requireRole('student'), createReview);

/**
 * @route   GET /api/reviews/course/:courseId
 * @desc    Get all reviews for a course (Public)
 * @access  Public
 */
router.get('/course/:courseId', getCourseReviews);

/**
 * @route   GET /api/reviews/instructor/my-reviews
 * @desc    Get all reviews for instructor's courses
 * @access  Private (Instructor)
 */
router.get('/instructor/my-reviews', auth, requireRole('instructor'), getInstructorReviews);

/**
 * @route   GET /api/reviews/admin/flagged
 * @desc    Get flagged reviews for moderation
 * @access  Private (Admin/Moderator)
 */
router.get('/admin/flagged', auth, getFlaggedReviews);

/**
 * @route   GET /api/reviews/my-review/:courseId
 * @desc    Get my review for a specific course
 * @access  Private (Student)
 */
router.get('/my-review/:courseId', auth, requireRole('student'), getMyReview);

/**
 * @route   GET /api/reviews/:reviewId
 * @desc    Get a specific review
 * @access  Public
 */
router.get('/:reviewId', getReview);

/**
 * @route   PUT /api/reviews/:reviewId
 * @desc    Update a review (only your own)
 * @access  Private (Student)
 */
router.put('/:reviewId', auth, requireRole('student'), updateReview);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete a review (only your own or admin)
 * @access  Private
 */
router.delete('/:reviewId', auth, deleteReview);

/**
 * @route   POST /api/reviews/:reviewId/helpful
 * @desc    Mark review as helpful/unhelpful
 * @access  Private
 */
router.post('/:reviewId/helpful', auth, markHelpful);

/**
 * @route   POST /api/reviews/:reviewId/flag
 * @desc    Flag a review for moderation
 * @access  Private
 */
router.post('/:reviewId/flag', auth, flagReview);

/**
 * @route   POST /api/reviews/:reviewId/response
 * @desc    Add instructor response to review
 * @access  Private (Instructor - course owner)
 */
router.post('/:reviewId/response', auth, requireRole('instructor'), addInstructorResponse);

/**
 * @route   PUT /api/reviews/:reviewId/response
 * @desc    Update instructor response
 * @access  Private (Instructor - course owner)
 */
router.put('/:reviewId/response', auth, requireRole('instructor'), updateInstructorResponse);

/**
 * @route   DELETE /api/reviews/:reviewId/response
 * @desc    Delete instructor response
 * @access  Private (Instructor - course owner)
 */
router.delete('/:reviewId/response', auth, requireRole('instructor'), deleteInstructorResponse);

/**
 * @route   PUT /api/reviews/:reviewId/moderate
 * @desc    Moderate review (approve/reject/remove)
 * @access  Private (Admin/Moderator)
 */
router.put('/:reviewId/moderate', auth, moderateReview);

module.exports = router;
