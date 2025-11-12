const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  getEnrollment,
  updateProgress,
  completeLecture,
  issueCertificate,
  addNote,
  updateNote,
  deleteNote,
  addBookmark,
  deleteBookmark,
  getCourseStats,
  getInstructorEnrollments
} = require('../controllers/enrollmentController');
const { auth, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Student enrollment routes
router.post('/', requireRole('student'), enrollCourse);
router.get('/', requireRole('student'), getMyEnrollments);
router.get('/:id', getEnrollment);
router.put('/:id/progress', requireRole('student'), updateProgress);
router.post('/:id/complete-lecture', requireRole('student'), completeLecture);

// Notes routes
router.post('/:id/notes', requireRole('student'), addNote);
router.put('/:id/notes/:noteId', requireRole('student'), updateNote);
router.delete('/:id/notes/:noteId', requireRole('student'), deleteNote);

// Bookmarks routes
router.post('/:id/bookmarks', requireRole('student'), addBookmark);
router.delete('/:id/bookmarks/:bookmarkId', requireRole('student'), deleteBookmark);

// Certificate routes
router.post('/:id/certificate', issueCertificate);

// Instructor routes
router.get('/course/:courseId/stats', requireRole('instructor'), getCourseStats);
router.get('/instructor/students', requireRole('instructor'), getInstructorEnrollments);

module.exports = router;
