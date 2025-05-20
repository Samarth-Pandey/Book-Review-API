const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const reviewController = require('../controllers/reviewController');

// Protected routes
router.post('/books/:id/reviews', protect, reviewController.addReview);
router.put('/reviews/:id', protect, reviewController.updateReview);
router.delete('/reviews/:id', protect, reviewController.deleteReview);

module.exports = router;