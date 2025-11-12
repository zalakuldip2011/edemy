const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Payment = require('../models/Payment');

/**
 * @desc    Enroll student in a course
 * @route   POST /api/enrollments
 * @access  Private (Student)
 */
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId, paymentId } = req.body;
    const studentId = req.user.id;

    // Validate required fields
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if course exists and is published
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Course is not available for enrollment'
      });
    }

    // Check if student is not the instructor
    if (course.instructor.toString() === studentId) {
      return res.status(400).json({
        success: false,
        message: 'Instructors cannot enroll in their own courses'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      status: { $in: ['active', 'completed'] }
    });
    
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
        enrollment: existingEnrollment
      });
    }

    // If course is free, create enrollment without payment
    if (course.price === 0 || course.isFree) {
      const enrollment = new Enrollment({
        student: studentId,
        course: courseId,
        instructor: course.instructor,
        enrolledAt: new Date()
      });

      await enrollment.save();

      // Increment student count
      course.studentCount = (course.studentCount || 0) + 1;
      await course.save();

      return res.status(201).json({
        success: true,
        message: 'Successfully enrolled in the course',
        enrollment
      });
    }

    // For paid courses, verify payment
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required for paid courses'
      });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment must be completed before enrollment'
      });
    }

    if (payment.student.toString() !== studentId || payment.course.toString() !== courseId) {
      return res.status(400).json({
        success: false,
        message: 'Payment does not match enrollment details'
      });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
      instructor: course.instructor,
      enrolledAt: new Date()
    });

    await enrollment.save();

    // Increment student count
    course.studentCount = (course.studentCount || 0) + 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course',
      enrollment
    });

  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while enrolling in course',
      error: error.message
    });
  }
};

/**
 * @desc    Get all enrollments for current student
 * @route   GET /api/enrollments/my-courses
 * @access  Private (Student)
 */
exports.getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { status, sortBy = 'enrolledAt', order = 'desc' } = req.query;

    const query = { student: studentId };
    if (status) {
      query.status = status;
    }

    const enrollments = await Enrollment.find(query)
      .populate({
        path: 'course',
        select: 'title description thumbnail price category level duration studentCount rating'
      })
      .populate({
        path: 'instructor',
        select: 'username email profilePicture'
      })
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 });

    // Calculate additional statistics
    const stats = {
      total: enrollments.length,
      active: enrollments.filter(e => e.status === 'active').length,
      completed: enrollments.filter(e => e.status === 'completed').length,
      totalProgress: enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length || 0,
      certificatesEarned: enrollments.filter(e => e.certificate?.isIssued).length
    };

    res.json({
      success: true,
      count: enrollments.length,
      stats,
      enrollments
    });

  } catch (error) {
    console.error('Get my enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enrollments',
      error: error.message
    });
  }
};

/**
 * @desc    Get single enrollment details
 * @route   GET /api/enrollments/:id
 * @access  Private (Student/Instructor)
 */
exports.getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'username email profilePicture'
        }
      })
      .populate({
        path: 'student',
        select: 'username email profilePicture'
      });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization (student or instructor)
    if (
      enrollment.student._id.toString() !== req.user.id &&
      enrollment.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this enrollment'
      });
    }

    res.json({
      success: true,
      enrollment
    });

  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enrollment',
      error: error.message
    });
  }
};

/**
 * @desc    Update enrollment progress
 * @route   PUT /api/enrollments/:id/progress
 * @access  Private (Student)
 */
exports.updateProgress = async (req, res) => {
  try {
    const { lectureId, timeSpent, completed } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment'
      });
    }

    // Update progress
    const updatedEnrollment = await enrollment.updateProgress(lectureId, timeSpent, completed);

    res.json({
      success: true,
      message: 'Progress updated successfully',
      enrollment: updatedEnrollment
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating progress',
      error: error.message
    });
  }
};

/**
 * @desc    Complete a lecture
 * @route   POST /api/enrollments/:id/complete-lecture
 * @access  Private (Student)
 */
exports.completeLecture = async (req, res) => {
  try {
    const { lectureId } = req.body;

    if (!lectureId) {
      return res.status(400).json({
        success: false,
        message: 'Lecture ID is required'
      });
    }

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment'
      });
    }

    // Complete lecture
    const updatedEnrollment = await enrollment.completeLecture(lectureId);

    res.json({
      success: true,
      message: 'Lecture completed successfully',
      enrollment: updatedEnrollment,
      progress: updatedEnrollment.progress
    });

  } catch (error) {
    console.error('Complete lecture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing lecture',
      error: error.message
    });
  }
};

/**
 * @desc    Issue certificate for course completion
 * @route   POST /api/enrollments/:id/certificate
 * @access  Private (System/Instructor)
 */
exports.issueCertificate = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization (instructor or system)
    if (
      req.user.role !== 'admin' &&
      enrollment.instructor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to issue certificate'
      });
    }

    // Check if course is completed
    if (enrollment.progress < 100) {
      return res.status(400).json({
        success: false,
        message: 'Certificate can only be issued after course completion'
      });
    }

    // Check if certificate already issued
    if (enrollment.certificate?.isIssued) {
      return res.json({
        success: true,
        message: 'Certificate already issued',
        certificate: enrollment.certificate
      });
    }

    // Issue certificate
    const updatedEnrollment = await enrollment.issueCertificate();

    res.json({
      success: true,
      message: 'Certificate issued successfully',
      certificate: updatedEnrollment.certificate
    });

  } catch (error) {
    console.error('Issue certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while issuing certificate',
      error: error.message
    });
  }
};

/**
 * @desc    Add note to enrollment
 * @route   POST /api/enrollments/:id/notes
 * @access  Private (Student)
 */
exports.addNote = async (req, res) => {
  try {
    const { lectureId, content } = req.body;

    if (!lectureId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Lecture ID and content are required'
      });
    }

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add notes to this enrollment'
      });
    }

    // Add note
    const updatedEnrollment = await enrollment.addNote(lectureId, content);

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      notes: updatedEnrollment.notes
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding note',
      error: error.message
    });
  }
};

/**
 * @desc    Update a note
 * @route   PUT /api/enrollments/:id/notes/:noteId
 * @access  Private (Student)
 */
exports.updateNote = async (req, res) => {
  try {
    const { content } = req.body;
    const { id, noteId } = req.params;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update notes in this enrollment'
      });
    }

    // Find and update note
    const note = enrollment.notes.id(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    note.content = content;
    note.updatedAt = new Date();

    await enrollment.save();

    res.json({
      success: true,
      message: 'Note updated successfully',
      note
    });

  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating note',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a note
 * @route   DELETE /api/enrollments/:id/notes/:noteId
 * @access  Private (Student)
 */
exports.deleteNote = async (req, res) => {
  try {
    const { id, noteId } = req.params;

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete notes in this enrollment'
      });
    }

    // Find and remove note
    const note = enrollment.notes.id(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    note.remove();
    await enrollment.save();

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting note',
      error: error.message
    });
  }
};

/**
 * @desc    Add bookmark to enrollment
 * @route   POST /api/enrollments/:id/bookmarks
 * @access  Private (Student)
 */
exports.addBookmark = async (req, res) => {
  try {
    const { lectureId, timestamp, title } = req.body;

    if (!lectureId || timestamp === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Lecture ID and timestamp are required'
      });
    }

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add bookmarks to this enrollment'
      });
    }

    // Add bookmark
    const updatedEnrollment = await enrollment.addBookmark(lectureId, timestamp, title);

    res.status(201).json({
      success: true,
      message: 'Bookmark added successfully',
      bookmarks: updatedEnrollment.bookmarks
    });

  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding bookmark',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a bookmark
 * @route   DELETE /api/enrollments/:id/bookmarks/:bookmarkId
 * @access  Private (Student)
 */
exports.deleteBookmark = async (req, res) => {
  try {
    const { id, bookmarkId } = req.params;

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete bookmarks in this enrollment'
      });
    }

    // Find and remove bookmark
    const bookmark = enrollment.bookmarks.id(bookmarkId);
    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    bookmark.remove();
    await enrollment.save();

    res.json({
      success: true,
      message: 'Bookmark deleted successfully'
    });

  } catch (error) {
    console.error('Delete bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting bookmark',
      error: error.message
    });
  }
};

/**
 * @desc    Get course statistics (for instructors)
 * @route   GET /api/enrollments/course/:courseId/stats
 * @access  Private (Instructor)
 */
exports.getCourseStats = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify course exists and user is instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view course statistics'
      });
    }

    const stats = await Enrollment.getCourseStats(courseId);

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get instructor's all enrollments
 * @route   GET /api/enrollments/instructor/students
 * @access  Private (Instructor)
 */
exports.getInstructorEnrollments = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const { status, courseId, sortBy = 'enrolledAt', order = 'desc' } = req.query;

    const query = { instructor: instructorId };
    if (status) query.status = status;
    if (courseId) query.course = courseId;

    const enrollments = await Enrollment.find(query)
      .populate({
        path: 'student',
        select: 'username email profilePicture'
      })
      .populate({
        path: 'course',
        select: 'title thumbnail category'
      })
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 });

    const stats = {
      total: enrollments.length,
      active: enrollments.filter(e => e.status === 'active').length,
      completed: enrollments.filter(e => e.status === 'completed').length,
      averageProgress: enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length || 0
    };

    res.json({
      success: true,
      count: enrollments.length,
      stats,
      enrollments
    });

  } catch (error) {
    console.error('Get instructor enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enrollments',
      error: error.message
    });
  }
};
