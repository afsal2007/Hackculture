const { historyService } = require('../services/history.service');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const historyController = {
  async getHistory(req, res, next) {
    try {
      const { items, total, page, limit } = await historyService.getHistory(req.query);
      return sendPaginated(res, {
        items,
        total,
        page,
        limit,
        message: 'History events retrieved successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  async getHistoryById(req, res, next) {
    try {
      const entry = await historyService.getHistoryById(req.params.id);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'History entry retrieved successfully',
        data: entry
      });
    } catch (err) {
      next(err);
    }
  },

  async createHistoryEntry(req, res, next) {
    try {
      const entry = await historyService.logEvent(req.body);
      return sendSuccess(res, {
        statusCode: 201,
        message: 'History entry recorded successfully',
        data: entry
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteHistoryEntry(req, res, next) {
    try {
      await historyService.deleteHistory(req.params.id);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'History entry deleted successfully',
        data: { id: req.params.id }
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = { historyController };
