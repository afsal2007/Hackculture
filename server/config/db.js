const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose.
 *
 * - Reads MONGODB_URI from environment variables (never hardcoded).
 * - Throws if the URI is missing so the calling code can handle it.
 * - Attaches connection event listeners for visibility after initial connect.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Log if the connection drops after initial connect
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    // Log when a reconnect succeeds
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully.');
    });

    // Surface any post-connect errors to the unhandledRejection handler
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error; // Let server.js handle the startup failure
  }
};

module.exports = connectDB;

