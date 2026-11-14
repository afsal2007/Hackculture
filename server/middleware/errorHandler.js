const config = require('../config');

/**
 * Centralized error handling middleware.
 * Captures and formats operational and system errors uniformly.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';
  let code = err.errorCode || 'INTERNAL_ERROR';
  let details = err.details || null;

  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_IDENTIFIER';
    message = `Invalid value "${err.value}" for parameter "${err.path}". Expected a valid identifier.`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 422;
    code = 'SCHEMA_VALIDATION_ERROR';
    message = 'Validation failed for model attributes';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
  }

  if (err.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_KEY';
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}. It must be unique.`;
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    code = 'MALFORMED_JSON';
    message = 'Request body contains invalid or malformed JSON.';
  }

  if (statusCode >= 500) {
    console.error(`[Server Error] ${req.method} ${req.url}:`, err);
  }

  return res.status(statusCode).json({
    success: false,
    status: 'error',
    error: {
      code,
      message,
      ...(details ? { details } : {})
    },
    ...(config.isDevelopment && statusCode >= 500 && !details && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
