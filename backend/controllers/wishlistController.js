const Wishlist = require('../models/Wishlist');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    console.log('❤️  GET WISHLIST for user:', req.user.id);

    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({
        path: 'items.course',
        select: 'title thumbnail price category level rating reviewCount instructor isPublished',
        populate: {
          path: 'instructor',
          select: 'username profile'
        }
      });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] });
    }

    // Filter out any courses that might have been deleted or unpublished
    wishlist.items = wishlist.items.filter(item => item.course && item.course.isPublished);
    await wishlist.save();

    console.log('   ✅ Wishlist retrieved:', wishlist.items.length, 'items');

    res.json({
      success: true,
      data: {
        wishlist,
        itemCount: wishlist.items.length
      }
    });
  } catch (error) {
    console.error('❌ Error getting wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
};

// @desc    Add course to wishlist
// @route   POST /api/wishlist/:courseId
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log('❤️  ADD TO WISHLIST - User:', req.user.id, 'Course:', courseId);

    // Check if course exists and is published
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not available'
      });
    }

    // Check if user already enrolled
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    });

    if (enrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] });
    }

    // Add item to wishlist
    const result = wishlist.addItem(courseId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    await wishlist.save();

    // Populate the wishlist for response
    await wishlist.populate({
      path: 'items.course',
      select: 'title thumbnail price category level rating reviewCount instructor',
      populate: {
        path: 'instructor',
        select: 'username profile'
      }
    });

    console.log('   ✅ Course added to wishlist');

    res.json({
      success: true,
      message: 'Course added to wishlist successfully',
      data: {
        wishlist,
        itemCount: wishlist.items.length
      }
    });
  } catch (error) {
    console.error('❌ Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding course to wishlist',
      error: error.message
    });
  }
};

// @desc    Remove course from wishlist
// @route   DELETE /api/wishlist/:courseId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log('❤️  REMOVE FROM WISHLIST - User:', req.user.id, 'Course:', courseId);

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.removeItem(courseId);
    await wishlist.save();

    // Populate the wishlist for response
    await wishlist.populate({
      path: 'items.course',
      select: 'title thumbnail price category level rating reviewCount instructor',
      populate: {
        path: 'instructor',
        select: 'username profile'
      }
    });

    console.log('   ✅ Course removed from wishlist');

    res.json({
      success: true,
      message: 'Course removed from wishlist successfully',
      data: {
        wishlist,
        itemCount: wishlist.items.length
      }
    });
  } catch (error) {
    console.error('❌ Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing course from wishlist',
      error: error.message
    });
  }
};

// @desc    Check if course is in wishlist
// @route   GET /api/wishlist/check/:courseId
// @access  Private
const checkWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    const isInWishlist = wishlist 
      ? wishlist.items.some(item => item.course.toString() === courseId)
      : false;

    res.json({
      success: true,
      data: {
        isInWishlist
      }
    });
  } catch (error) {
    console.error('❌ Error checking wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking wishlist',
      error: error.message
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
};
