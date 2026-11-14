const mongoose = require('mongoose');
const { HISTORY_ACTION } = require('../utils/constants');

const researchHistorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResearchSession',
      required: [true, 'Session ID is required for history tracking'],
      index: true
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResearchTask',
      default: null,
      index: true
    },
    action: {
      type: String,
      enum: {
        values: Object.values(HISTORY_ACTION),
        message: '{VALUE} is not a recognized history action'
      },
      required: [true, 'History action type is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'History title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    actor: {
      type: String,
      default: 'System',
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

researchHistorySchema.virtual('task', {
  ref: 'ResearchTask',
  localField: 'taskId',
  foreignField: '_id',
  justOne: true
});

researchHistorySchema.virtual('session', {
  ref: 'ResearchSession',
  localField: 'sessionId',
  foreignField: '_id',
  justOne: true
});

const ResearchHistory = mongoose.model('ResearchHistory', researchHistorySchema);

module.exports = { ResearchHistory };

