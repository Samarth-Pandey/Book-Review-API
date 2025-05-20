// models/associations.js
const User = require('./User');
const Book = require('./Book');
const Review = require('./Review');

// Define associations
User.hasMany(Book, { foreignKey: 'addedBy' });
Book.belongsTo(User, { foreignKey: 'addedBy' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Review, { foreignKey: 'bookId' });
Review.belongsTo(Book, { foreignKey: 'bookId' });

module.exports = { User, Book, Review };