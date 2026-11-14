const mongoose = require('mongoose');
const { SESSION_STATUS } = require('../utils/constants');

const researchSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: [200, 'Session title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    targetSubject: {
      type: String,
      required: [true, 'Target company or person name is required'],
      trim: true,
      index: true
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
    status: {
      type: String,
      enum: {
        values: Object.values(SESSION_STATUS),
        message: '{VALUE} is not a valid session status'
      },
      default: SESSION_STATUS.ACTIVE,
      index: true
    },
    tags: {
      type: [String],
      default: []
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

researchSessionSchema.virtual('tasks', {
  ref: 'ResearchTask',
  localField: '_id',
  foreignField: 'sessionId'
});

researchSessionSchema.virtual('history', {
  ref: 'ResearchHistory',
  localField: '_id',
  foreignField: 'sessionId'
});

const ResearchSession = mongoose.model('ResearchSession', researchSessionSchema);

module.exports = { ResearchSession };

