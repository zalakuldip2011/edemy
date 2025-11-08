const Course = require('../models/Course');
const User = require('../models/User');

// Public course endpoints for students

// Get all published courses with filters and search
const getCourses = async (req, res) => {
  try {
    const {
      search,
      category,
      level,
      minPrice,
      maxPrice,
      rating,
      tags,
      sortBy,
      page = 1,
      limit = 20
    } = req.query;

    const filters = {
      ...(category && { category }),
      ...(level && { level }),
      ...(minPrice !== undefined && { minPrice: parseFloat(minPrice) }),
      ...(maxPrice !== undefined && { maxPrice: parseFloat(maxPrice) }),
      ...(rating && { rating: parseFloat(rating) }),
      ...(tags && { tags: tags.split(',') }),
      sortBy,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };

    const courses = await Course.searchCourses(search, filters);
    const total = await Course.countDocuments({ isPublished: true });

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalCourses: total,
          hasNext: parseInt(page) * parseInt(limit) < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses'
    });
  }
};

// Get courses by category
const getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const courses = await Course.getCoursesByCategory(category, parseInt(limit));

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses by category'
    });
  }
};

// Get featured courses
const getFeaturedCourses = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const courses = await Course.find({
      isPublished: true,
      featured: true
    })
    .populate('instructor', 'name profilePicture')
    .sort({ averageRating: -1, totalEnrollments: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured courses'
    });
  }
};

// Get popular tags
const getPopularTags = async (req, res) => {
  try {
    const tags = await Course.getPopularTags();

    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular tags'
    });
  }
};

// Get course by ID with similar courses
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email profilePicture instructorProfile')
      .populate('reviews.student', 'name profilePicture');

    if (!course || !course.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get similar courses
    const similarCourses = await course.getSimilarCourses();

    res.json({
      success: true,
      data: {
        course,
        similarCourses
      }
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course'
    });
  }
};

// Get course categories with counts
const getCategories = async (req, res) => {
  try {
    const categories = await Course.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories.map(cat => ({
        category: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
};

// Instructor course management endpoints

// Get all courses for an instructor
const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('instructor', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses'
    });
  }
};

// Get course statistics for instructor dashboard
const getCourseStats = async (req, res) => {
  try {
    const instructorId = req.user._id;
    
    const stats = await Course.aggregate([
      { $match: { instructor: instructorId } },
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          publishedCourses: {
            $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
          },
          draftCourses: {
            $sum: { $cond: [{ $eq: ['$isPublished', false] }, 1, 0] }
          },
          totalEnrollments: { $sum: '$totalEnrollments' },
          totalRevenue: { $sum: { $multiply: ['$price', '$totalEnrollments'] } },
          averageRating: { $avg: '$averageRating' }
        }
      }
    ]);

    const result = stats[0] || {
      totalCourses: 0,
      publishedCourses: 0,
      draftCourses: 0,
      totalEnrollments: 0,
      totalRevenue: 0,
      averageRating: 0
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching course stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course statistics'
    });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    console.log('Received course data:', req.body);
    console.log('User:', req.user);
    
    const {
      title,
      subtitle,
      description,
      category,
      level,
      price,
      language,
      learningOutcomes,
      requirements,
      prerequisites,
      targetAudience,
      tags,
      sections,
      status,
      thumbnail
    } = req.body;

    // Prepare course data
    const courseData = {
      title: title || '',
      subtitle: subtitle || '',
      description: description || '',
      category: category || '',
      level: level || '',
      price: parseFloat(price) || 0,
      language: language || 'English',
      learningOutcomes: learningOutcomes || [],
      requirements: requirements || prerequisites || [],
      targetAudience: targetAudience || '',
      tags: tags || [],
      sections: sections || [],
      thumbnail: thumbnail || '',
      instructor: req.user._id,
      status: status || 'draft',
      isPublished: status === 'published'
    };

    // Calculate total lectures and duration
    let totalLectures = 0;
    let totalDuration = 0;
    if (sections && Array.isArray(sections)) {
      sections.forEach(section => {
        if (section.lectures && Array.isArray(section.lectures)) {
          totalLectures += section.lectures.length;
          section.lectures.forEach(lecture => {
            if (lecture.duration) {
              totalDuration += parseFloat(lecture.duration) * 60; // Convert minutes to seconds
            }
          });
        }
      });
    }
    
    courseData.totalLectures = totalLectures;
    courseData.totalDuration = totalDuration;

    console.log('Creating course with data:', courseData);

    const course = new Course(courseData);

    // If publishing, set published date
    if (status === 'published') {
      course.publishedAt = new Date();
    }

    await course.save();

    // Populate instructor data for response
    await course.populate('instructor', 'name email profilePicture');

    console.log('Course saved successfully:', course._id);

    res.status(201).json({
      success: true,
      message: status === 'published' ? 'Course published successfully' : 'Course saved as draft',
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validationErrors.join(', '),
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// Get a single course (instructor only)
const getInstructorCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email profilePicture instructorProfile');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor of this course
    if (course.instructor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this course'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course'
    });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor of this course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'name email profilePicture');

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor of this course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    // Check if course has enrollments
    if (course.totalEnrollments > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete course with active enrollments'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course'
    });
  }
};

// Publish/Unpublish course
const toggleCourseStatus = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor of this course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course'
      });
    }

    // Validate course before publishing
    if (!course.isPublished && course.sections.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot publish course without content sections'
      });
    }

    if (course.isPublished) {
      course.unpublish();
    } else {
      course.publish();
    }

    await course.save();

    res.json({
      success: true,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      data: course
    });
  } catch (error) {
    console.error('Error toggling course status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course status'
    });
  }
};

module.exports = {
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
};