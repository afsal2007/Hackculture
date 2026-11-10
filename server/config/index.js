const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/research_agent_arena',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};

module.exports = config;

