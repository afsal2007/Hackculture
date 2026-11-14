const Joi = require('joi');
const { objectIdSchema } = require('../middleware/validate');
const { TASK_STATUS, SUBJECT_TYPE, AGENT_STATUS, WINNER, BRIEFING_CHOICE, SEARCH_DEPTH } = require('../utils/constants');

const taskValidator = {
  idParam: {
    params: Joi.object({
      id: objectIdSchema.required()
    })
  },

  createTask: {
    body: Joi.object({
      sessionId: objectIdSchema.required().messages({
        'any.required': 'sessionId is required to associate this research task'
      }),
      subjectName: Joi.string().min(2).max(150).required().messages({
        'any.required': 'subjectName (company or person name) is required'
      }),
      subjectType: Joi.string().valid(...Object.values(SUBJECT_TYPE)).default(SUBJECT_TYPE.COMPANY),
      meetingPurpose: Joi.string().min(3).max(300).required().messages({
        'any.required': 'meetingPurpose is required'
      }),
      targetDate: Joi.date().iso().allow(null).optional(),
      additionalContext: Joi.string().allow('').max(2000).default(''),
      status: Joi.string().valid(...Object.values(TASK_STATUS)).default(TASK_STATUS.PENDING)
    })
  },

  updateTask: {
    params: Joi.object({
      id: objectIdSchema.required()
    }),
    body: Joi.object({
      subjectName: Joi.string().min(2).max(150).optional(),
      subjectType: Joi.string().valid(...Object.values(SUBJECT_TYPE)).optional(),
      meetingPurpose: Joi.string().min(3).max(300).optional(),
      targetDate: Joi.date().iso().allow(null).optional(),
      additionalContext: Joi.string().allow('').max(2000).optional(),
      status: Joi.string().valid(...Object.values(TASK_STATUS)).optional()
    }).min(1).messages({
      'object.min': 'At least one field must be provided to update task'
    })
  },

  updateStatus: {
    params: Joi.object({
      id: objectIdSchema.required()
    }),
    body: Joi.object({
      status: Joi.string().valid(...Object.values(TASK_STATUS)).required().messages({
        'any.required': 'status is required'
      }),
      errorMessage: Joi.string().allow(null, '').optional()
    })
  },

  saveTavilyData: {
    params: Joi.object({
      id: objectIdSchema.required()
    }),
    body: Joi.object({
      query: Joi.string().min(2).required().messages({
        'any.required': 'Search query is required'
      }),
      searchDepth: Joi.string().valid(...Object.values(SEARCH_DEPTH)).default(SEARCH_DEPTH.BASIC),
      results: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
          url: Joi.string().uri().required(),
          content: Joi.string().required(),
          score: Joi.number().optional().default(0),
          publishedDate: Joi.string().allow(null, '').optional()
        })
      ).required().messages({
        'any.required': 'Search results array is required'
      })
    })
  },

  saveAgentResults: {
    params: Joi.object({
      id: objectIdSchema.required()
    }),
    body: Joi.object({
      agentKey: Joi.string().valid('agentA', 'agentB').required().messages({
        'any.required': 'agentKey must be either agentA or agentB'
      }),
      name: Joi.string().optional(),
      model: Joi.string().optional(),
      status: Joi.string().valid(...Object.values(AGENT_STATUS)).default(AGENT_STATUS.COMPLETED),
      briefing: Joi.object({
        summary: Joi.string().allow('').default(''),
        companyOverview: Joi.string().allow('').default(''),
        keyPersonnel: Joi.array().items(Joi.string()).default([]),
        recentDevelopments: Joi.array().items(Joi.string()).default([]),
        discussionPoints: Joi.array().items(Joi.string()).default([]),
        risksAndChallenges: Joi.array().items(Joi.string()).default([])
      }).required().messages({
        'any.required': 'Agent briefing payload is required'
      }),
      executionTimeMs: Joi.number().min(0).default(0),
      tokenUsage: Joi.object({
        promptTokens: Joi.number().min(0).default(0),
        completionTokens: Joi.number().min(0).default(0),
        totalTokens: Joi.number().min(0).default(0)
      }).optional(),
      errorMessage: Joi.string().allow(null, '').optional(),
      rawResponse: Joi.any().optional()
    })
  },

  saveEvaluation: {
    params: Joi.object({
      id: objectIdSchema.required()
    }),
    body: Joi.object({
      metrics: Joi.object({
        agentA: Joi.object({
          relevanceScore: Joi.number().min(0).max(10).required(),
          depthScore: Joi.number().min(0).max(10).required(),
          accuracyScore: Joi.number().min(0).max(10).required(),
          actionabilityScore: Joi.number().min(0).max(10).required(),
          clarityScore: Joi.number().min(0).max(10).required(),
          totalScore: Joi.number().min(0).max(50).optional()
        }).required(),
        agentB: Joi.object({
          relevanceScore: Joi.number().min(0).max(10).required(),
          depthScore: Joi.number().min(0).max(10).required(),
          accuracyScore: Joi.number().min(0).max(10).required(),
          actionabilityScore: Joi.number().min(0).max(10).required(),
          clarityScore: Joi.number().min(0).max(10).required(),
          totalScore: Joi.number().min(0).max(50).optional()
        }).required()
      }).required(),
      winner: Joi.string().valid(...Object.values(WINNER)).required(),
      benchmarkSummary: Joi.string().allow('').default(''),
      strengthsA: Joi.array().items(Joi.string()).default([]),
      strengthsB: Joi.array().items(Joi.string()).default([])
    })
  },

  saveFinalBriefing: {
    params: Joi.object({
      id: objectIdSchema.required()
    }),
    body: Joi.object({
      chosenAgent: Joi.string().valid(...Object.values(BRIEFING_CHOICE)).default(BRIEFING_CHOICE.AGENT_A),
      title: Joi.string().allow('').max(200).default(''),
      content: Joi.string().min(10).required().messages({
        'any.required': 'Meeting briefing content is required'
      })
    })
  },

  listTasks: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      sessionId: objectIdSchema.optional(),
      status: Joi.string().valid(...Object.values(TASK_STATUS)).optional(),
      subjectName: Joi.string().trim().allow('').optional(),
      sortBy: Joi.string().valid('createdAt', 'updatedAt', 'subjectName', 'status').default('createdAt'),
      sortOrder: Joi.string().valid('asc', 'desc').default('desc')
    })
  }
};

module.exports = { taskValidator };

