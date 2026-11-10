/**
 * Utility functions for standardized API response structures.
 */

/**
 * Format a successful response
 * @param {string} message
 * @param {any} data
 */
const successResponse = (message, data = null) => {
  const response = {
    status: 'success',
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return response;
};

/**
 * Format an error response
 * @param {string} message
 * @param {any} details
 */
const errorResponse = (message, details = null) => {
  const response = {
    status: 'error',
    message,
    timestamp: new Date().toISOString()
  };

  if (details !== null) {
    response.details = details;
  }

  return response;
};

module.exports = {
  successResponse,
  errorResponse
};

