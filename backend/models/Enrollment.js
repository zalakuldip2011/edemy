const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required'],
    index: true
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required'],
    index: true
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Instructor ID is required'],
    index: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'refunded', 'expired'],
    default: 'active',
    index: true
  },
  progress: {
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedLectures: [{
      lecture: {
        type: mongoose.Schema.ObjectId
      },
      completedAt: {
        type: Date,
        default: Date.now
      },
      watchTime: {
        type: Number, // Total seconds watched
        default: 0
      }
    }],
    completedSections: [{
      section: {
        type: mongoose.Schema.ObjectId
      },
      completedAt: {
        type: Date,
        default: Date.now
      }
    }],
    lastAccessedLecture: {
      type: mongoose.Schema.ObjectId,
      default: null
    },
    lastAccessedSection: {
      type: mongoose.Schema.ObjectId,
      default: null
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now
    },
    totalWatchTime: {
      type: Number, // Total seconds spent watching course
      default: 0
    }
  },
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: {
      type: Date
    },
    certificateId: {
      type: String,
      unique: true,
      sparse: true // Only unique if not null
    },
    certificateUrl: {
      type: String
    }
  },
  payment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payment'
  },
  rating: {
    hasRated: {
      type: Boolean,
      default: false
    },
    ratedAt: {
      type: Date
    },
    review: {
      type: mongoose.Schema.ObjectId,
      ref: 'Review'
    }
  },
  notes: [{
    lecture: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
    },
    timestamp: {
      type: Number, // Video timestamp in seconds
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookmarks: [{
    lecture: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    timestamp: {
      type: Number, // Video timestamp in seconds
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  expiresAt: {
    type: Date, // For limited-time access courses
    default: null
  },
  accessType: {
    type: String,
    enum: ['lifetime', 'subscription', 'limited'],
    default: 'lifetime'
  },
  metadata: {
    enrollmentSource: {
      type: String,
      enum: ['direct_purchase', 'gift', 'free', 'promotion', 'bundle'],
      default: 'direct_purchase'
    },
    device: {
      type: String
    },
    ipAddress: {
      type: String
    },
    referrer: {
      type: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for common queries
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true }); // One enrollment per student per course
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1, status: 1 });
enrollmentSchema.index({ instructor: 1, status: 1 });
enrollmentSchema.index({ enrolledAt: -1 });
enrollmentSchema.index({ 'progress.percentage': 1 });

// Virtual for isCompleted
enrollmentSchema.virtual('isCompleted').get(function() {
  return this.progress.percentage === 100 && this.status === 'completed';
});

// Virtual for daysEnrolled
enrollmentSchema.virtual('daysEnrolled').get(function() {
  const now = new Date();
  const enrolled = new Date(this.enrolledAt);
  return Math.floor((now - enrolled) / (1000 * 60 * 60 * 24));
});

// Virtual for isExpired
enrollmentSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Methods

/**
 * Mark a lecture as completed
 */
enrollmentSchema.methods.completeLecture = function(lectureId, watchTime = 0) {
  // Check if lecture already completed
  const existingIndex = this.progress.completedLectures.findIndex(
    cl => cl.lecture.toString() === lectureId.toString()
  );
  
  if (existingIndex === -1) {
    this.progress.completedLectures.push({
      lecture: lectureId,
      completedAt: new Date(),
      watchTime
    });
  } else {
    // Update watch time if lecture already completed
    this.progress.completedLectures[existingIndex].watchTime += watchTime;
  }
  
  this.progress.totalWatchTime += watchTime;
  this.progress.lastAccessedAt = new Date();
  
  return this.save();
};

/**
 * Update progress percentage
 */
enrollmentSchema.methods.updateProgress = async function(courseId) {
  const Course = mongoose.model('Course');
  const course = await Course.findById(courseId);
  
  if (!course) return;
  
  const totalLectures = course.totalLectures || 0;
  const completedLectures = this.progress.completedLectures.length;
  
  if (totalLectures > 0) {
    this.progress.percentage = Math.round((completedLectures / totalLectures) * 100);
    
    // Mark as completed if 100%
    if (this.progress.percentage === 100 && this.status === 'active') {
      this.status = 'completed';
    }
  }
  
  return this.save();
};

/**
 * Issue certificate
 */
enrollmentSchema.methods.issueCertificate = function() {
  if (this.progress.percentage !== 100) {
    throw new Error('Course must be 100% complete to issue certificate');
  }
  
  // Generate unique certificate ID
  const crypto = require('crypto');
  const certificateId = `CERT-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  
  this.certificate.issued = true;
  this.certificate.issuedAt = new Date();
  this.certificate.certificateId = certificateId;
  this.certificate.certificateUrl = `/api/certificates/${certificateId}`;
  
  return this.save();
};

/**
 * Add note to lecture
 */
enrollmentSchema.methods.addNote = function(lectureId, content, timestamp = 0) {
  this.notes.push({
    lecture: lectureId,
    content,
    timestamp,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return this.save();
};

/**
 * Update note
 */
enrollmentSchema.methods.updateNote = function(noteId, content) {
  const note = this.notes.id(noteId);
  if (!note) {
    throw new Error('Note not found');
  }
  
  note.content = content;
  note.updatedAt = new Date();
  
  return this.save();
};

/**
 * Delete note
 */
enrollmentSchema.methods.deleteNote = function(noteId) {
  this.notes.id(noteId).remove();
  return this.save();
};

/**
 * Add bookmark
 */
enrollmentSchema.methods.addBookmark = function(lectureId, title, timestamp = 0) {
  this.bookmarks.push({
    lecture: lectureId,
    title,
    timestamp,
    createdAt: new Date()
  });
  
  return this.save();
};

/**
 * Delete bookmark
 */
enrollmentSchema.methods.deleteBookmark = function(bookmarkId) {
  this.bookmarks.id(bookmarkId).remove();
  return this.save();
};

/**
 * Update last accessed lecture
 */
enrollmentSchema.methods.updateLastAccessed = function(lectureId, sectionId = null) {
  this.progress.lastAccessedLecture = lectureId;
  if (sectionId) {
    this.progress.lastAccessedSection = sectionId;
  }
  this.progress.lastAccessedAt = new Date();
  
  return this.save();
};

/**
 * Cancel enrollment (student requested)
 */
enrollmentSchema.methods.cancel = function(reason = '') {
  this.status = 'cancelled';
  this.metadata.cancellationReason = reason;
  this.metadata.cancelledAt = new Date();
  
  return this.save();
};

/**
 * Refund enrollment (instructor/admin)
 */
enrollmentSchema.methods.refund = function(reason = '') {
  this.status = 'refunded';
  this.metadata.refundReason = reason;
  this.metadata.refundedAt = new Date();
  
  return this.save();
};

// Static Methods

/**
 * Get student's active enrollments
 */
enrollmentSchema.statics.getActiveEnrollments = function(studentId) {
  return this.find({
    student: studentId,
    status: 'active'
  })
  .populate('course', 'title thumbnail instructor totalLectures totalDuration')
  .populate('instructor', 'username profile.firstName profile.lastName profile.avatar')
  .sort({ 'progress.lastAccessedAt': -1 });
};

/**
 * Get student's completed courses
 */
enrollmentSchema.statics.getCompletedCourses = function(studentId) {
  return this.find({
    student: studentId,
    status: 'completed'
  })
  .populate('course', 'title thumbnail instructor')
  .populate('instructor', 'username profile.firstName profile.lastName')
  .sort({ 'progress.completedAt': -1 });
};

/**
 * Get course enrollments for instructor
 */
enrollmentSchema.statics.getCourseEnrollments = function(courseId, filters = {}) {
  const query = { course: courseId };
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  return this.find(query)
    .populate('student', 'username email profile.firstName profile.lastName profile.avatar')
    .sort({ enrolledAt: -1 });
};

/**
 * Get enrollment statistics for course
 */
enrollmentSchema.statics.getCourseStats = async function(courseId) {
  const stats = await this.aggregate([
    { $match: { course: mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgProgress: { $avg: '$progress.percentage' },
        avgWatchTime: { $avg: '$progress.totalWatchTime' }
      }
    }
  ]);
  
  const totalEnrollments = stats.reduce((sum, stat) => sum + stat.count, 0);
  const completionRate = stats.find(s => s._id === 'completed')?.count || 0;
  
  return {
    total: totalEnrollments,
    byStatus: stats,
    completionRate: totalEnrollments > 0 ? (completionRate / totalEnrollments * 100).toFixed(2) : 0
  };
};

/**
 * Get instructor's total enrollments
 */
enrollmentSchema.statics.getInstructorStats = async function(instructorId) {
  const stats = await this.aggregate([
    { $match: { instructor: mongoose.Types.ObjectId(instructorId) } },
    {
      $group: {
        _id: null,
        totalEnrollments: { $sum: 1 },
        activeEnrollments: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        completedEnrollments: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        avgProgress: { $avg: '$progress.percentage' },
        totalWatchTime: { $sum: '$progress.totalWatchTime' }
      }
    }
  ]);
  
  return stats[0] || {
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    avgProgress: 0,
    totalWatchTime: 0
  };
};

/**
 * Check if student is enrolled in course
 */
enrollmentSchema.statics.isEnrolled = async function(studentId, courseId) {
  const enrollment = await this.findOne({
    student: studentId,
    course: courseId,
    status: { $in: ['active', 'completed'] }
  });
  
  return !!enrollment;
};

// Pre-save middleware
enrollmentSchema.pre('save', function(next) {
  // Update last accessed
  if (this.isModified('progress.completedLectures') || this.isModified('progress.lastAccessedLecture')) {
    this.progress.lastAccessedAt = new Date();
  }
  
  next();
});

// Post-save middleware to update course enrollment count
enrollmentSchema.post('save', async function(doc) {
  if (this.isNew && this.status === 'active') {
    const Course = mongoose.model('Course');
    await Course.findByIdAndUpdate(doc.course, {
      $inc: { totalEnrollments: 1 }
    });
  }
});

// Post-remove middleware to decrement course enrollment count
enrollmentSchema.post('remove', async function(doc) {
  const Course = mongoose.model('Course');
  await Course.findByIdAndUpdate(doc.course, {
    $inc: { totalEnrollments: -1 }
  });
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
