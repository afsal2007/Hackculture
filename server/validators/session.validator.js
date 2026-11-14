const Joi = require('joi');
const { objectIdSchema } = require('../middleware/validate');
const { SESSION_STATUS } = require('../utils/constants');

const sessionValidator = {
  idParam: {
    params: Joi.object({
      id: objectIdSchema.required()
    })
  },

  createSession: {
    body: Joi.object({
      title: Joi.string().min(2).max(200).required().messages({
        'any.required': 'Session title is required',
        'string.min': 'Session title must be at least 2 characters',
        'string.max': 'Session title cannot exceed 200 characters'
      }),
      description: Joi.string().allow('').max(1000).default(''),
      targetSubject: Joi.string().min(2).max(150).required().messages({
        'any.required': 'Target subject (company or person name) is required'
      }),
      meetingPurpose: Joi.string().min(3).max(300).required().messages({
        'any.required': 'Meeting purpose is required'
      }),
      targetDate: Joi.date().iso().allow(null).optional(),
      status: Joi.string().valid(...Object.values(SESSION_STATUS)).default(SESSION_STATUS.ACTIVE),
      tags: Joi.array().items(Joi.string().trim()).default([]),
      metadata: Joi.object().default({})
    })
  },

  updateSession: {
    params: Joi.object({
      id: objectIdSchema.required()
    }),
    body: Joi.object({
      title: Joi.string().min(2).max(200).optional(),
      description: Joi.string().allow('').max(1000).optional(),
      targetSubject: Joi.string().min(2).max(150).optional(),
      meetingPurpose: Joi.string().min(3).max(300).optional(),
      targetDate: Joi.date().iso().allow(null).optional(),
      status: Joi.string().valid(...Object.values(SESSION_STATUS)).optional(),
      tags: Joi.array().items(Joi.string().trim()).optional(),
      metadata: Joi.object().optional()
    }).min(1).messages({
      'object.min': 'At least one field must be provided to update session'
    })
  },

  listSessions: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      search: Joi.string().trim().allow('').optional(),
      status: Joi.string().valid(...Object.values(SESSION_STATUS)).optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'title', 'targetDate').default('createdAt'),
      sortOrder: Joi.string().valid('asc', 'desc').default('desc')
    })
  }
};

module.exports = { sessionValidator };

