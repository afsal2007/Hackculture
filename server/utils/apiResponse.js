/**
 * Standardized API Response Helpers
 * Research Agent Arena
 */

/**
 * Format a successful response object (legacy compatibility)
 * @param {string} message
 * @param {any} data
 */
const successResponse = (message, data = null) => {
  const response = {
    status: 'success',
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return response;
};

/**
 * Format an error response object (legacy compatibility)
 * @param {string} message
 * @param {any} details
 */
const errorResponse = (message, details = null) => {
  const response = {
    status: 'error',
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (details !== null) {
    response.details = details;
  }

  return response;
};

/**
 * Format and send a successful JSON response
 * @param {import('express').Response} res
 * @param {Object} options
 */
const sendSuccess = (res, { statusCode = 200, message = 'Success', data = null, meta = null } = {}) => {
  const responseBody = {
    success: true,
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString()
  };

  if (meta !== null && meta !== undefined) {
    responseBody.meta = meta;
  }

  return res.status(statusCode).json(responseBody);
};

/**
 * Format and send a paginated list response
 * @param {import('express').Response} res
 * @param {Object} options
 */
const sendPaginated = (res, { items, total, page, limit, message = 'Data fetched successfully' }) => {
  const totalPages = Math.ceil(total / limit) || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return sendSuccess(res, {
    statusCode: 200,
    message,
    data: items,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      hasNextPage,
      hasPrevPage
    }
  });
};

/**
 * Format and send an error JSON response
 * @param {import('express').Response} res
 * @param {Object} options
 */
const sendError = (res, { statusCode = 500, message = 'Internal Server Error', code = 'INTERNAL_ERROR', details = null } = {}) => {
  const responseBody = {
    success: false,
    status: 'error',
    error: {
      code,
      message,
      ...(details ? { details } : {})
    },
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(responseBody);
};

module.exports = {
  successResponse,
  errorResponse,
  sendSuccess,
  sendPaginated,
  sendError
};
