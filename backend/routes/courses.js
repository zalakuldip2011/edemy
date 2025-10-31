const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const {
  // Public endpoints
  getCourses,
  getCoursesByCategory,
  getFeaturedCourses,
  getPopularTags,
  getCourseById,
  getCategories,
  
  // Instructor endpoints
  getInstructorCourses,
  getCourseStats,
  createCourse,
  getInstructorCourse,
  updateCourse,
  deleteCourse,
  toggleCourseStatus
} = require('../controllers/courseController');

// Public course routes (no authentication required)
router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/categories', getCategories);
router.get('/tags/popular', getPopularTags);
router.get('/category/:category', getCoursesByCategory);
router.get('/public/:id', getCourseById);

// Instructor course routes (require authentication and instructor role)
router.get('/instructor/dashboard/stats', auth, requireRole('instructor'), getCourseStats);
router.get('/instructor', auth, requireRole('instructor'), getInstructorCourses);
router.post('/instructor', auth, requireRole('instructor'), createCourse);
router.get('/instructor/:id', auth, requireRole('instructor'), getInstructorCourse);
router.put('/instructor/:id', auth, requireRole('instructor'), updateCourse);
router.delete('/instructor/:id', auth, requireRole('instructor'), deleteCourse);
router.patch('/instructor/:id/status', auth, requireRole('instructor'), toggleCourseStatus);

module.exports = router;