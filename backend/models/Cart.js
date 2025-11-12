const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total price before saving
cartSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((total, item) => total + item.price, 0);
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(courseId, price) {
  const existingItem = this.items.find(item => item.course.toString() === courseId.toString());
  
  if (existingItem) {
    return { success: false, message: 'Course already in cart' };
  }
  
  this.items.push({ course: courseId, price });
  return { success: true, message: 'Course added to cart' };
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(courseId) {
  this.items = this.items.filter(item => item.course.toString() !== courseId.toString());
  return { success: true, message: 'Course removed from cart' };
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.totalPrice = 0;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
