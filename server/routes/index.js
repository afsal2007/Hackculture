const express = require('express');
const healthRoutes = require('./health.routes');

const router = express.Router();

// Mount feature routes
router.use('/health', healthRoutes);

module.exports = router;

