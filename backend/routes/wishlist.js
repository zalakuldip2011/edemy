const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
} = require('../controllers/wishlistController');

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.get('/check/:courseId', checkWishlist);
router.post('/:courseId', addToWishlist);
router.delete('/:courseId', removeFromWishlist);

module.exports = router;
