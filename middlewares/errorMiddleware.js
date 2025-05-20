const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      error: err.errors.map(e => e.message)
    });
  }

  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found'
  });
};

module.exports = { errorHandler, notFound };