const { ResearchHistory } = require('../models/ResearchHistory');
const { ApiError } = require('../utils/apiError');

const historyService = {
  async logEvent({ sessionId, taskId = null, action, title, description = '', payload = null, actor = 'System' }) {
    try {
      const historyEntry = await ResearchHistory.create({
        sessionId,
        taskId,
        action,
        title,
        description,
        payload,
        actor
      });
      return historyEntry;
    } catch (err) {
      console.error(`[History Log Error] Failed to record event: ${err.message}`);
      return null;
    }
  },

  async getHistory({ page = 1, limit = 20, sessionId, taskId, action, sortBy = 'timestamp', sortOrder = 'desc' }) {
    const filter = {};
    if (sessionId) filter.sessionId = sessionId;
    if (taskId) filter.taskId = taskId;
    if (action) filter.action = action;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      ResearchHistory.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      ResearchHistory.countDocuments(filter)
    ]);

    return { items, total, page, limit };
  },

  async getHistoryById(id) {
    const entry = await ResearchHistory.findById(id).populate('task').populate('session').lean();
    if (!entry) {
      throw ApiError.notFound(`History entry with ID ${id} not found`);
    }
    return entry;
  },

  async deleteHistory(id) {
    const entry = await ResearchHistory.findByIdAndDelete(id);
    if (!entry) {
      throw ApiError.notFound(`History entry with ID ${id} not found`);
    }
    return entry;
  }
};

module.exports = { historyService };
