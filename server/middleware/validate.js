const Joi = require('joi');
const { ApiError } = require('../utils/apiError');

const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message('Invalid ID format. Must be a valid 24-character hexadecimal MongoDB ObjectId.');

const validate = (schema) => {
  return (req, res, next) => {
    const validations = ['params', 'query', 'body'];
    const errors = [];

    for (const key of validations) {
      if (schema[key]) {
        const { error, value } = schema[key].validate(req[key], {
          abortEarly: false,
          stripUnknown: true
        });

        if (error) {
          error.details.forEach((detail) => {
            errors.push({
              field: detail.path.join('.'),
              message: detail.message.replace(/['"]/g, ''),
              location: key
            });
          });
        } else {
          req[key] = value;
        }
      }
    }

    if (errors.length > 0) {
      return next(ApiError.unprocessable('Validation failed', errors));
    }

    next();
  };
};

module.exports = {
  validate,
  objectIdSchema
};

