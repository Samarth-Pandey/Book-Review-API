// After importing all models
// User.hasMany(Review, { foreignKey: 'userId' });
// Review.belongsTo(User, { foreignKey: 'userId' });

// Book.hasMany(Review, { foreignKey: 'bookId' });
// Review.belongsTo(Book, { foreignKey: 'bookId' });

// User.hasMany(Book, { foreignKey: 'addedBy' });
// Book.belongsTo(User, { foreignKey: 'addedBy' });

const { User, Book, Review } = require('./models/associations');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Load env vars
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bookController = require('./controllers/bookController');

// Initialize express
const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Mount routers
app.use('/api', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api', reviewRoutes);
app.get('/api/search', bookController.searchBooks);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;