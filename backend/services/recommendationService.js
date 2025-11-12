const Course = require('../models/Course');

/**
 * Get personalized course recommendations based on user interests
 * @param {Object} user - User object with interests
 * @param {Number} limit - Number of courses to return
 * @returns {Array} - Array of recommended courses
 */
const getPersonalizedCourses = async (user, limit = 12) => {
  try {
    console.log('🎯 Getting personalized courses for user:', user.id);
    console.log('   User interests:', user.interests);

    // If user hasn't set interests, return popular courses
    if (!user.interests || !user.interests.hasCompletedInterests || !user.interests.categories || user.interests.categories.length === 0) {
      console.log('   No interests set, returning popular courses');
      return await Course.find({ 
        isPublished: true,
        status: 'published'
      })
        .sort({ enrollmentCount: -1, rating: -1 })
        .limit(limit)
        .populate('instructor', 'username email profile')
        .lean();
    }

    const { categories, skillLevel } = user.interests;

    // Build query to match courses
    const query = {
      isPublished: true,
      status: 'published'
    };

    // Match categories (case-insensitive, flexible matching)
    if (categories && categories.length > 0) {
      // Create regex patterns for flexible matching
      const categoryPatterns = categories.map(cat => new RegExp(cat, 'i'));
      
      query.$or = [
        { category: { $in: categoryPatterns } },
        { subcategory: { $in: categoryPatterns } },
        { tags: { $in: categoryPatterns } }
      ];
    }

    // Match skill level if specified
    const levelMapping = {
      'beginner': ['Beginner', 'All Levels', 'Introductory'],
      'intermediate': ['Intermediate', 'All Levels', 'Beginner', 'Advanced'],
      'advanced': ['Advanced', 'Intermediate', 'All Levels', 'Expert'],
      'expert': ['Expert', 'Advanced', 'All Levels']
    };

    if (skillLevel && levelMapping[skillLevel]) {
      query.level = { $in: levelMapping[skillLevel] };
    }

    console.log('   Query:', JSON.stringify(query, null, 2));

    // Get courses matching interests
    let courses = await Course.find(query)
      .sort({ 
        rating: -1, 
        enrollmentCount: -1,
        createdAt: -1 
      })
      .limit(limit * 2) // Get more to filter and sort
      .populate('instructor', 'username email profile')
      .lean();

    console.log('   Found', courses.length, 'matching courses');

    // If not enough courses found, supplement with popular courses
    if (courses.length < limit) {
      const remainingLimit = limit - courses.length;
      const courseIds = courses.map(c => c._id);
      
      const additionalCourses = await Course.find({
        isPublished: true,
        status: 'published',
        _id: { $nin: courseIds }
      })
        .sort({ enrollmentCount: -1, rating: -1 })
        .limit(remainingLimit)
        .populate('instructor', 'username email profile')
        .lean();

      courses = [...courses, ...additionalCourses];
      console.log('   Added', additionalCourses.length, 'popular courses');
    }

    // Calculate relevance score for each course
    courses = courses.map(course => {
      let relevanceScore = 0;

      // Category match (highest weight)
      if (categories && categories.length > 0) {
        const matchedCategories = categories.filter(cat => 
          (course.category && course.category.toLowerCase().includes(cat.toLowerCase())) ||
          (course.subcategory && course.subcategory.toLowerCase().includes(cat.toLowerCase())) ||
          (course.tags && course.tags.some(tag => tag.toLowerCase().includes(cat.toLowerCase())))
        );
        relevanceScore += matchedCategories.length * 50;
      }

      // Skill level match
      if (skillLevel && course.level) {
        const userLevelIndex = ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skillLevel.toLowerCase());
        const courseLevelIndex = ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(course.level.toLowerCase());
        
        if (courseLevelIndex === userLevelIndex) {
          relevanceScore += 30; // Perfect match
        } else if (Math.abs(courseLevelIndex - userLevelIndex) === 1) {
          relevanceScore += 15; // Adjacent level
        }
      }

      // Rating boost (0-5 stars = 0-10 points)
      if (course.rating) {
        relevanceScore += (course.rating / 5) * 10;
      }

      // Popularity boost (enrollment count)
      if (course.enrollmentCount) {
        relevanceScore += Math.min(course.enrollmentCount / 10, 10);
      }

      // Recent courses boost
      const daysSinceCreation = (Date.now() - new Date(course.createdAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceCreation < 30) {
        relevanceScore += 5;
      }

      return {
        ...course,
        relevanceScore
      };
    });

    // Sort by relevance score
    courses.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Remove relevance score from final results and limit
    courses = courses.slice(0, limit).map(({ relevanceScore, ...course }) => course);

    console.log('   Returning', courses.length, 'personalized courses');

    return courses;

  } catch (error) {
    console.error('❌ Error getting personalized courses:', error);
    throw error;
  }
};

/**
 * Get recommended courses for a category
 * @param {String} category - Category name
 * @param {Number} limit - Number of courses to return
 * @returns {Array} - Array of courses
 */
const getCoursesByCategory = async (category, limit = 12) => {
  try {
    const categoryRegex = new RegExp(category, 'i');
    
    const courses = await Course.find({
      isPublished: true,
      status: 'published',
      $or: [
        { category: categoryRegex },
        { subcategory: categoryRegex },
        { tags: categoryRegex }
      ]
    })
      .sort({ rating: -1, enrollmentCount: -1 })
      .limit(limit)
      .populate('instructor', 'username email profile')
      .lean();

    return courses;
  } catch (error) {
    console.error('Error getting courses by category:', error);
    throw error;
  }
};

/**
 * Get trending courses
 * @param {Number} limit - Number of courses to return
 * @returns {Array} - Array of courses
 */
const getTrendingCourses = async (limit = 12) => {
  try {
    // Get courses with high enrollment in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const courses = await Course.find({
      isPublished: true,
      status: 'published',
      createdAt: { $gte: thirtyDaysAgo }
    })
      .sort({ enrollmentCount: -1, rating: -1 })
      .limit(limit)
      .populate('instructor', 'username email profile')
      .lean();

    return courses;
  } catch (error) {
    console.error('Error getting trending courses:', error);
    throw error;
  }
};

module.exports = {
  getPersonalizedCourses,
  getCoursesByCategory,
  getTrendingCourses
};
