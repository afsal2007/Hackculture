/**
 * Middleware to handle 404 (Not Found) errors for undefined routes.
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

module.exports = notFoundHandler;

