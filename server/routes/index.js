const express = require('express');
const healthRoutes = require('./health.routes');
const sessionRoutes = require('./session.routes');
const taskRoutes = require('./task.routes');
const historyRoutes = require('./history.routes');

const router = express.Router();

// Health check
router.use('/health', healthRoutes);

// Versioned API v1
router.use('/v1/sessions', sessionRoutes);
router.use('/v1/tasks', taskRoutes);
router.use('/v1/history', historyRoutes);

// Convenient root aliases
router.use('/sessions', sessionRoutes);
router.use('/tasks', taskRoutes);
router.use('/history', historyRoutes);

module.exports = router;
