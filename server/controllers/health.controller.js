/**
 * Health check controller
 * Handles GET /api/health
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Research Agent Arena API is running',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};

