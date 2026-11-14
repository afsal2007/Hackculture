const mongoose = require('mongoose');
const { TASK_STATUS, SUBJECT_TYPE, AGENT_STATUS, WINNER, BRIEFING_CHOICE, SEARCH_DEPTH } = require('../utils/constants');

const tavilySearchResultSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    content: { type: String, required: true },
    score: { type: Number, default: 0 },
    publishedDate: { type: String, default: null }
  },
  { _id: false }
);

const agentBriefingSchema = new mongoose.Schema(
  {
    summary: { type: String, default: '' },
    companyOverview: { type: String, default: '' },
    keyPersonnel: { type: [String], default: [] },
    recentDevelopments: { type: [String], default: [] },
    discussionPoints: { type: [String], default: [] },
    risksAndChallenges: { type: [String], default: [] }
  },
  { _id: false }
);

const agentRunSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    model: { type: String, default: 'gemini-1.5' },
    status: {
      type: String,
      enum: Object.values(AGENT_STATUS),
      default: AGENT_STATUS.IDLE
    },
    briefing: {
      type: agentBriefingSchema,
      default: () => ({})
    },
    executionTimeMs: { type: Number, default: 0 },
    tokenUsage: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 }
    },
    completedAt: { type: Date, default: null },
    errorMessage: { type: String, default: null },
    rawResponse: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  { _id: false }
);

const scoreMetricsSchema = new mongoose.Schema(
  {
    relevanceScore: { type: Number, min: 0, max: 10, default: 0 },
    depthScore: { type: Number, min: 0, max: 10, default: 0 },
    accuracyScore: { type: Number, min: 0, max: 10, default: 0 },
    actionabilityScore: { type: Number, min: 0, max: 10, default: 0 },
    clarityScore: { type: Number, min: 0, max: 10, default: 0 },
    totalScore: { type: Number, min: 0, max: 50, default: 0 }
  },
  { _id: false }
);

const researchTaskSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResearchSession',
      required: [true, 'Session ID is required'],
      index: true
    },
    subjectName: {
      type: String,
      required: [true, 'Subject name (company or person) is required'],
      trim: true,
      index: true
    },
    subjectType: {
      type: String,
      enum: Object.values(SUBJECT_TYPE),
      default: SUBJECT_TYPE.COMPANY
    },
    meetingPurpose: {
      type: String,
      required: [true, 'Meeting purpose is required'],
      trim: true
    },
    targetDate: {
      type: Date,
      default: null
    },
    additionalContext: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.PENDING,
      index: true
    },
    tavilyData: {
      query: { type: String, default: '' },
      searchDepth: {
        type: String,
        enum: Object.values(SEARCH_DEPTH),
        default: SEARCH_DEPTH.BASIC
      },
      results: { type: [tavilySearchResultSchema], default: [] },
      searchedAt: { type: Date, default: null }
    },
    agents: {
      agentA: {
        type: agentRunSchema,
        default: () => ({
          name: 'Agent A (Gemini 1.5 Pro)',
          model: 'gemini-1.5-pro',
          status: AGENT_STATUS.IDLE
        })
      },
      agentB: {
        type: agentRunSchema,
        default: () => ({
          name: 'Agent B (Gemini 1.5 Flash)',
          model: 'gemini-1.5-flash',
          status: AGENT_STATUS.IDLE
        })
      }
    },
    evaluation: {
      evaluated: { type: Boolean, default: false },
      evaluatedAt: { type: Date, default: null },
      metrics: {
        agentA: { type: scoreMetricsSchema, default: () => ({}) },
        agentB: { type: scoreMetricsSchema, default: () => ({}) }
      },
      winner: {
        type: String,
        enum: Object.values(WINNER),
        default: WINNER.UNDECIDED
      },
      benchmarkSummary: { type: String, default: '' },
      strengthsA: { type: [String], default: [] },
      strengthsB: { type: [String], default: [] }
    },
    finalBriefing: {
      chosenAgent: {
        type: String,
        enum: Object.values(BRIEFING_CHOICE),
        default: BRIEFING_CHOICE.AGENT_A
      },
      title: { type: String, default: '' },
      content: { type: String, default: '' },
      savedAt: { type: Date, default: null }
    },
    errorMessage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

researchTaskSchema.virtual('session', {
  ref: 'ResearchSession',
  localField: 'sessionId',
  foreignField: '_id',
  justOne: true
});

const ResearchTask = mongoose.model('ResearchTask', researchTaskSchema);

module.exports = { ResearchTask };

