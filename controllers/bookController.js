const { Op } = require('sequelize');
const Book = require('../models/Book');
const Review = require('../models/Review');
const User = require('../models/User');

// Helper function for pagination
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

// Helper function for paging data
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: books } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, books, totalPages, currentPage };
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
exports.addBook = async (req, res, next) => {
  try {
    const { title, author, genre, description, publishedYear } = req.body;

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      publishedYear,
      addedBy: req.user.id
    });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    const { page = 1, size = 10, author, genre } = req.query;
    const { limit, offset } = getPagination(page, size);

    const where = {};
    if (author) where.author = author;
    if (genre) where.genre = genre;

    const books = await Book.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: Review,
          attributes: ['id', 'rating', 'comment', 'createdAt'],
          include: {
            model: User,
            attributes: ['id', 'username']
          }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const response = getPagingData(books, page, limit);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, size = 5 } = req.query;
    const { limit, offset } = getPagination(page, size);

    const book = await Book.findByPk(id, {
      include: [
        {
          model: Review,
          limit,
          offset,
          attributes: ['id', 'rating', 'comment', 'createdAt'],
          include: {
            model: User,
            attributes: ['id', 'username']
          },
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Calculate average rating
    const reviews = await Review.findAll({
      where: { bookId: id },
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']]
    });

    const avgRating = reviews[0].dataValues.avgRating || 0;

    res.json({
      ...book.toJSON(),
      avgRating: parseFloat(avgRating).toFixed(1)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search books by title or author
// @route   GET /api/search
// @access  Public
exports.searchBooks = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { author: { [Op.iLike]: `%${q}%` } }
        ]
      },
      limit: 10
    });

    res.json(books);
  } catch (error) {
    next(error);
  }
};