const Review = require('../models/Review');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Add a review to a book
// @route   POST /api/books/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { id: bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      where: { bookId, userId }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = await Review.create({
      rating,
      comment,
      bookId,
      userId
    });

    const newReview = await Review.findByPk(review.id, {
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Book, attributes: ['id', 'title'] }
      ]
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the review belongs to the user
    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    res.json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the review belongs to the user
    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.destroy();

    res.json({ message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};