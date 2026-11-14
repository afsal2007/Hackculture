const { taskService } = require('../services/task.service');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');

const taskController = {
  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.body);
      return sendSuccess(res, {
        statusCode: 201,
        message: 'Research task created successfully',
        data: task
      });
    } catch (err) {
      next(err);
    }
  },

  async getTasks(req, res, next) {
    try {
      const { items, total, page, limit } = await taskService.getAllTasks(req.query);
      return sendPaginated(res, {
        items,
        total,
        page,
        limit,
        message: 'Research tasks retrieved successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Research task retrieved successfully',
        data: task
      });
    } catch (err) {
      next(err);
    }
  },

  async updateTask(req, res, next) {
    try {
      const updated = await taskService.updateTask(req.params.id, req.body);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Research task updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteTask(req, res, next) {
    try {
      await taskService.deleteTask(req.params.id);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Research task deleted successfully',
        data: { id: req.params.id }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const updated = await taskService.updateTaskStatus(req.params.id, req.body);
      return sendSuccess(res, {
        statusCode: 200,
        message: `Task status updated to ${req.body.status}`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async saveTavilyData(req, res, next) {
    try {
      const updated = await taskService.saveTavilyData(req.params.id, req.body);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Tavily web research results saved successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async saveAgentResults(req, res, next) {
    try {
      const updated = await taskService.saveAgentResults(req.params.id, req.body);
      return sendSuccess(res, {
        statusCode: 200,
        message: `${req.body.agentKey} research briefing stored successfully`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async saveEvaluation(req, res, next) {
    try {
      const updated = await taskService.saveEvaluation(req.params.id, req.body);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Evaluation and benchmarking metrics stored successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async saveFinalBriefing(req, res, next) {
    try {
      const updated = await taskService.saveFinalBriefing(req.params.id, req.body);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Final meeting briefing saved successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async getArenaStats(req, res, next) {
    try {
      const stats = await taskService.getArenaStats();
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Arena benchmark statistics retrieved',
        data: stats
      });
    } catch (err) {
      next(err);
    }
  },

  async exportBriefing(req, res, next) {
    try {
      const data = await taskService.exportBriefing(req.params.id);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Briefing exported as markdown',
        data
      });
    } catch (err) {
      next(err);
    }
  },

  async simulateArenaRun(req, res, next) {
    try {
      const task = await taskService.simulateArenaRun(req.params.id);
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Arena simulation completed successfully',
        data: task
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = { taskController };
