const { sessionService } = require('../services/session.service');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const sessionController = {
  async createSession(req, res, next) {
    try {
      const session = await sessionService.createSession(req.body);
      return sendSuccess(res, {
        statusCode: 201,
        message: 'Research session created successfully',
        data: session
      });
    } catch (err) {
      next(err);
    }
  },

  async getSessions(req, res, next) {
    try {
      const { items, total, page, limit } = await sessionService.getAllSessions(req.query);
      return sendPaginated(res, {
        items,
        total,
        page,
        limit,
        message: 'Research sessions retrieved successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  async getSessionById(req, res, next) {
    try {
      const session = await sessionService.getSessionById(req.params.id);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Research session details retrieved',
        data: session
      });
    } catch (err) {
      next(err);
    }
  },

  async updateSession(req, res, next) {
    try {
      const updated = await sessionService.updateSession(req.params.id, req.body);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Research session updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteSession(req, res, next) {
    try {
      await sessionService.deleteSession(req.params.id);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Research session and related tasks deleted successfully',
        data: { id: req.params.id }
      });
    } catch (err) {
      next(err);
    }
  },

  async getSessionHistory(req, res, next) {
    try {
      const data = await sessionService.getSessionHistory(req.params.id);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Session history timeline retrieved',
        data
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = { sessionController };
