const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const bookController = require('../controllers/bookController');

// Public routes
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBook);

// Protected routes
router.post('/', protect, bookController.addBook);

module.exports = router;