const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/:courseId', addToCart);
router.delete('/:courseId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
