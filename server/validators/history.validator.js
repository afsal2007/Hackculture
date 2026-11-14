const Joi = require('joi');
const { objectIdSchema } = require('../middleware/validate');
const { HISTORY_ACTION } = require('../utils/constants');

const historyValidator = {
  idParam: {
    params: Joi.object({
      id: objectIdSchema.required()
    })
  },

  listHistory: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      sessionId: objectIdSchema.optional(),
      taskId: objectIdSchema.optional(),
      action: Joi.string().valid(...Object.values(HISTORY_ACTION)).optional(),
      sortBy: Joi.string().valid('timestamp').default('timestamp'),
      sortOrder: Joi.string().valid('asc', 'desc').default('desc')
    })
  },

  createHistoryEntry: {
    body: Joi.object({
      sessionId: objectIdSchema.required().messages({
        'any.required': 'sessionId is required to record history'
      }),
      taskId: objectIdSchema.optional().allow(null),
      action: Joi.string().valid(...Object.values(HISTORY_ACTION)).default(HISTORY_ACTION.NOTE_ADDED),
      title: Joi.string().min(2).max(200).required().messages({
        'any.required': 'History entry title is required'
      }),
      description: Joi.string().allow('').default(''),
      payload: Joi.any().optional(),
      actor: Joi.string().max(100).default('User')
    })
  }
};

module.exports = { historyValidator };
