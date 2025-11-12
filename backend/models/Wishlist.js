const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema]
}, {
  timestamps: true
});

// Method to add item to wishlist
wishlistSchema.methods.addItem = function(courseId) {
  const existingItem = this.items.find(item => item.course.toString() === courseId.toString());
  
  if (existingItem) {
    return { success: false, message: 'Course already in wishlist' };
  }
  
  this.items.push({ course: courseId });
  return { success: true, message: 'Course added to wishlist' };
};

// Method to remove item from wishlist
wishlistSchema.methods.removeItem = function(courseId) {
  this.items = this.items.filter(item => item.course.toString() !== courseId.toString());
  return { success: true, message: 'Course removed from wishlist' };
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
