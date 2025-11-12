const Cart = require('../models/Cart');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    console.log('🛒 GET CART for user:', req.user.id);

    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.course',
        select: 'title thumbnail price category level rating reviewCount instructor',
        populate: {
          path: 'instructor',
          select: 'username profile'
        }
      });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Filter out any courses that might have been deleted or unpublished
    cart.items = cart.items.filter(item => item.course && item.course.isPublished);
    await cart.save();

    console.log('   ✅ Cart retrieved:', cart.items.length, 'items');

    res.json({
      success: true,
      data: {
        cart,
        itemCount: cart.items.length
      }
    });
  } catch (error) {
    console.error('❌ Error getting cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// @desc    Add course to cart
// @route   POST /api/cart/:courseId
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log('🛒 ADD TO CART - User:', req.user.id, 'Course:', courseId);

    // Check if course exists and is published
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not available'
      });
    }

    // Check if course is free
    if (course.price === 0) {
      return res.status(400).json({
        success: false,
        message: 'Free courses cannot be added to cart. Please enroll directly.'
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

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Add item to cart
    const result = cart.addItem(courseId, course.price);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    await cart.save();

    // Populate the cart for response
    await cart.populate({
      path: 'items.course',
      select: 'title thumbnail price category level rating reviewCount instructor',
      populate: {
        path: 'instructor',
        select: 'username profile'
      }
    });

    console.log('   ✅ Course added to cart');

    res.json({
      success: true,
      message: 'Course added to cart successfully',
      data: {
        cart,
        itemCount: cart.items.length
      }
    });
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding course to cart',
      error: error.message
    });
  }
};

// @desc    Remove course from cart
// @route   DELETE /api/cart/:courseId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log('🛒 REMOVE FROM CART - User:', req.user.id, 'Course:', courseId);

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.removeItem(courseId);
    await cart.save();

    // Populate the cart for response
    await cart.populate({
      path: 'items.course',
      select: 'title thumbnail price category level rating reviewCount instructor',
      populate: {
        path: 'instructor',
        select: 'username profile'
      }
    });

    console.log('   ✅ Course removed from cart');

    res.json({
      success: true,
      message: 'Course removed from cart successfully',
      data: {
        cart,
        itemCount: cart.items.length
      }
    });
  } catch (error) {
    console.error('❌ Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing course from cart',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    console.log('🛒 CLEAR CART for user:', req.user.id);

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.clearCart();
    await cart.save();

    console.log('   ✅ Cart cleared');

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart,
        itemCount: 0
      }
    });
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};
