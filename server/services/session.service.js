const { ResearchSession } = require('../models/ResearchSession');
const { ResearchTask } = require('../models/ResearchTask');
const { ResearchHistory } = require('../models/ResearchHistory');
const { historyService } = require('./history.service');
const { ApiError } = require('../utils/apiError');
const { HISTORY_ACTION } = require('../utils/constants');

const sessionService = {
  async createSession(data) {
    const session = await ResearchSession.create(data);

    await historyService.logEvent({
      sessionId: session._id,
      action: HISTORY_ACTION.SESSION_CREATED,
      title: `Research Session Created: "${session.title}"`,
      description: `Session initiated for subject "${session.targetSubject}" with purpose: "${session.meetingPurpose}"`,
      payload: {
        sessionId: session._id,
        targetSubject: session.targetSubject,
        meetingPurpose: session.meetingPurpose,
        status: session.status
      },
      actor: 'User'
    });

    return session;
  },

  async getAllSessions({ page = 1, limit = 10, search = '', status, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { targetSubject: { $regex: search, $options: 'i' } },
        { meetingPurpose: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      ResearchSession.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ResearchSession.countDocuments(filter)
    ]);

    return { items, total, page, limit };
  },

  async getSessionById(id) {
    const session = await ResearchSession.findById(id).populate('tasks').lean();
    if (!session) {
      throw ApiError.notFound(`Research session with ID ${id} not found`);
    }
    return session;
  },

  async updateSession(id, updateData) {
    const session = await ResearchSession.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    if (!session) {
      throw ApiError.notFound(`Research session with ID ${id} not found`);
    }

    await historyService.logEvent({
      sessionId: session._id,
      action: HISTORY_ACTION.SESSION_UPDATED,
      title: `Research Session Updated: "${session.title}"`,
      description: `Fields updated: ${Object.keys(updateData).join(', ')}`,
      payload: updateData,
      actor: 'User'
    });

    return session;
  },

  async deleteSession(id) {
    const session = await ResearchSession.findByIdAndDelete(id);
    if (!session) {
      throw ApiError.notFound(`Research session with ID ${id} not found`);
    }

    await Promise.all([
      ResearchTask.deleteMany({ sessionId: id }),
      ResearchHistory.deleteMany({ sessionId: id })
    ]);

    return session;
  },

  async getSessionHistory(sessionId) {
    const session = await ResearchSession.findById(sessionId).lean();
    if (!session) {
      throw ApiError.notFound(`Research session with ID ${sessionId} not found`);
    }

    const timeline = await ResearchHistory.find({ sessionId })
      .sort({ timestamp: 1 })
      .lean();

    return { session, timeline };
  }
};

module.exports = { sessionService };
