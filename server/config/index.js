const dotenv = require('dotenv');
const path = require('path');

// Ensure dotenv loads the server's .env file regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Validates and parses environment variables into a centralized configuration object.
 *
 * @param {NodeJS.ProcessEnv} env - Environment object (defaults to process.env)
 * @returns {Readonly<{
 *   port: number,
 *   nodeEnv: 'development' | 'production' | 'test',
 *   mongodbUri: string,
 *   clientUrl: string,
 *   isProduction: boolean,
 *   isDevelopment: boolean,
 *   isTest: boolean
 * }>}
 */
function parseConfig(env = process.env) {
  // 1. Validate NODE_ENV
  const rawNodeEnv = env.NODE_ENV || 'development';
  const allowedEnvs = ['development', 'production', 'test'];
  if (!allowedEnvs.includes(rawNodeEnv)) {
    throw new Error(
      `Invalid configuration: NODE_ENV must be one of [${allowedEnvs.join(', ')}], received "${rawNodeEnv}".`
    );
  }

  // 2. Validate PORT
  const rawPort = env.PORT !== undefined && env.PORT !== '' ? env.PORT : 5000;
  const portNum = Number(rawPort);
  if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
    throw new Error(
      `Invalid configuration: PORT must be a valid integer between 1 and 65535, received "${rawPort}".`
    );
  }

  // 3. Validate MONGODB_URI
  const rawMongoUri = env.MONGODB_URI;
  if (!rawMongoUri || typeof rawMongoUri !== 'string' || !rawMongoUri.trim()) {
    throw new Error(
      'Missing required configuration: MONGODB_URI is required and cannot be empty.'
    );
  }
  const trimmedMongoUri = rawMongoUri.trim();
  if (!trimmedMongoUri.startsWith('mongodb://') && !trimmedMongoUri.startsWith('mongodb+srv://')) {
    throw new Error(
      'Invalid configuration: MONGODB_URI must start with "mongodb://" or "mongodb+srv://".'
    );
  }

  // 4. Validate CLIENT_URL
  const rawClientUrl = env.CLIENT_URL !== undefined && env.CLIENT_URL !== '' ? env.CLIENT_URL : 'http://localhost:5173';
  const trimmedClientUrl = typeof rawClientUrl === 'string' ? rawClientUrl.trim() : '';
  if (!trimmedClientUrl) {
    throw new Error('Invalid configuration: CLIENT_URL cannot be empty.');
  }

  if (trimmedClientUrl !== '*') {
    try {
      new URL(trimmedClientUrl);
    } catch {
      throw new Error(
        `Invalid configuration: CLIENT_URL must be a valid URL (e.g. "http://localhost:5173") or "*", received "${trimmedClientUrl}".`
      );
    }
  }

  return Object.freeze({
    port: portNum,
    nodeEnv: rawNodeEnv,
    mongodbUri: trimmedMongoUri,
    clientUrl: trimmedClientUrl,
    isProduction: rawNodeEnv === 'production',
    isDevelopment: rawNodeEnv === 'development',
    isTest: rawNodeEnv === 'test'
  });
}

// Parse process.env singleton
const config = parseConfig(process.env);

const configExport = {
  ...config,
  parseConfig
};

module.exports = Object.freeze(configExport);



