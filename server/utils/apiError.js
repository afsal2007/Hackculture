/**
 * Custom API Error Class
 * Standardizes operational and domain errors across controllers and services.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.errorCode = errorCode || this.getDefaultErrorCode(statusCode);
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  getDefaultErrorCode(statusCode) {
    switch (statusCode) {
      case 400: return 'BAD_REQUEST';
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 409: return 'CONFLICT';
      case 422: return 'VALIDATION_ERROR';
      default: return 'INTERNAL_SERVER_ERROR';
    }
  }

  static badRequest(msg, details = null) {
    return new ApiError(400, msg, details, 'BAD_REQUEST');
  }

  static notFound(msg = 'Resource not found', details = null) {
    return new ApiError(404, msg, details, 'NOT_FOUND');
  }

  static unprocessable(msg, details = null) {
    return new ApiError(422, msg, details, 'VALIDATION_ERROR');
  }

  static conflict(msg, details = null) {
    return new ApiError(409, msg, details, 'CONFLICT');
  }

  static internal(msg = 'Internal server error') {
    return new ApiError(500, msg, null, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { ApiError };

