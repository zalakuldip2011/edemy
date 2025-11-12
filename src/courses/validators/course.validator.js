/**
 * Express-validator middleware for course validation
 */

const { body, param, validationResult } = require('express-validator');

/**
 * Validation error handler middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

/**
 * Validator for creating a course
 */
const createCourseValidator = [
  body('title')
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters')
    .trim(),
  
  body('category')
    .optional()
    .isIn([
      'Web Development', 'Mobile Development', 'Programming Languages',
      'Data Science', 'Machine Learning', 'Artificial Intelligence',
      'Design', 'Business', 'Marketing', 'Personal Development',
      'Photography', 'Music', 'Health & Fitness', 'Uncategorized'
    ])
    .withMessage('Invalid category'),
  
  body('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Level must be Beginner, Intermediate, or Advanced'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  
  body('visibility')
    .optional()
    .isIn(['public', 'private', 'unlisted'])
    .withMessage('Visibility must be public, private, or unlisted'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('learningOutcomes')
    .optional()
    .isArray()
    .withMessage('Learning outcomes must be an array'),
  
  body('prerequisites')
    .optional()
    .isArray()
    .withMessage('Prerequisites must be an array'),
  
  body('sections')
    .optional()
    .isArray()
    .withMessage('Sections must be an array'),
  
  handleValidationErrors
];

/**
 * Validator for updating a course
 */
const updateCourseValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),
  
  body('title')
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters')
    .trim(),
  
  body('category')
    .optional()
    .isIn([
      'Web Development', 'Mobile Development', 'Programming Languages',
      'Data Science', 'Machine Learning', 'Artificial Intelligence',
      'Design', 'Business', 'Marketing', 'Personal Development',
      'Photography', 'Music', 'Health & Fitness', 'Uncategorized'
    ])
    .withMessage('Invalid category'),
  
  body('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Level must be Beginner, Intermediate, or Advanced'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  
  handleValidationErrors
];

/**
 * Validator for publishing a course
 */
const publishCourseValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),
  
  handleValidationErrors
];

/**
 * Validator for getting course by ID
 */
const getCourseByIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),
  
  handleValidationErrors
];

/**
 * Validator for deleting a course
 */
const deleteCourseValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),
  
  handleValidationErrors
];

/**
 * Custom validation for course readiness
 */
const validateCourseReadiness = (course) => {
  const errors = [];
  
  if (!course.title || course.title.trim().length < 3) {
    errors.push({
      field: 'title',
      message: 'Course title is required (minimum 3 characters)'
    });
  }
  
  if (!course.description || course.description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Course description is required (minimum 10 characters)'
    });
  }
  
  if (!course.category || course.category === 'Uncategorized') {
    errors.push({
      field: 'category',
      message: 'Please select a valid category'
    });
  }
  
  if (!course.learningOutcomes || course.learningOutcomes.length < 3) {
    errors.push({
      field: 'learningOutcomes',
      message: 'At least 3 learning outcomes are required'
    });
  }
  
  if (!course.sections || course.sections.length < 1) {
    errors.push({
      field: 'sections',
      message: 'At least 1 section is required'
    });
  }
  
  // Check if all sections have lectures
  if (course.sections && course.sections.length > 0) {
    const emptySections = course.sections.filter(s => 
      !s.lectures || s.lectures.length === 0
    );
    if (emptySections.length > 0) {
      errors.push({
        field: 'sections',
        message: 'All sections must have at least one lecture'
      });
    }
  }
  
  if (!course.thumbnailUrl || course.thumbnailUrl.trim().length === 0) {
    errors.push({
      field: 'thumbnailUrl',
      message: 'Course thumbnail is required'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  createCourseValidator,
  updateCourseValidator,
  publishCourseValidator,
  getCourseByIdValidator,
  deleteCourseValidator,
  validateCourseReadiness,
  handleValidationErrors
};
