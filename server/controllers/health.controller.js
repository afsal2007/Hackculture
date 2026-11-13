const mongoose = require('mongoose');

/**
 * Health check controller
 * Handles GET /api/health
 *
 * Reports server status, database connection state, and current timestamp.
 * Does NOT expose credentials or sensitive configuration details.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getHealthStatus = (req, res) => {
  // Mongoose connection states: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const dbState = mongoose.connection.readyState;
  const dbStatus = dbStateMap[dbState] || 'unknown';

  const isHealthy = dbState === 1; // only "connected" is fully healthy

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'success' : 'degraded',
    message: 'Research Agent Arena API is running',
    server: 'up',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};

