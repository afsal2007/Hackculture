const mongoose = require('mongoose');
const config = require('./index');

let isConnected = false;
let connectionPromise = null;
let listenersAttached = false;

/**
 * Configure lifecycle event listeners for the Mongoose connection.
 * Attached only once to prevent duplicate event callbacks.
 */
function attachConnectionListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log(`MongoDB connection established: ${mongoose.connection.host || 'connected'}`);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('MongoDB disconnected. Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('MongoDB reconnected successfully.');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB runtime connection error: ${err.message}`);
  });
}

/**
 * Connect to MongoDB using Mongoose.
 *
 * - Reads MONGODB_URI from centralized config.
 * - Prevents duplicate connection attempts by reusing in-flight or established connections.
 * - Throws on initial connection failure so server startup halts appropriately.
 *
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async () => {
  // If already connected (readyState 1: connected), return existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If connection is in progress (readyState 2: connecting), return active promise
  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  attachConnectionListeners();

  connectionPromise = (async () => {
    try {
      const conn = await mongoose.connect(config.mongodbUri);
      isConnected = true;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      isConnected = false;
      connectionPromise = null;
      console.error(`MongoDB initial connection failed: ${error.message}`);
      throw error;
    }
  })();

  return connectionPromise;
};

/**
 * Gracefully disconnect from MongoDB.
 *
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    connectionPromise = null;
    console.log('MongoDB connection closed gracefully.');
  }
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.disconnectDB = disconnectDB;


