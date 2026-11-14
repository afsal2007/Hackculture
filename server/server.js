const config = require('./config');
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

let server = null;
let isStarting = false;
let isShuttingDown = false;

/**
 * Gracefully shuts down the HTTP server and MongoDB connection.
 * @param {string} signal - The termination signal received.
 */
const gracefulShutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\nReceived ${signal}. Initiating graceful shutdown...`);

  // 1. Close HTTP server first (stop accepting new requests)
  if (server) {
    await new Promise((resolve) => {
      server.close((err) => {
        if (err) {
          console.error(`Error closing HTTP server: ${err.message}`);
        } else {
          console.log('HTTP server closed successfully.');
        }
        resolve();
      });
    });
  }

  // 2. Close MongoDB connection
  try {
    await disconnectDB();
  } catch (err) {
    console.error(`Error closing MongoDB connection: ${err.message}`);
  }

  console.log('Graceful shutdown completed.');
  process.exit(0);
};

/**
 * Start the server only after a successful MongoDB connection.
 * This prevents the API from accepting requests before the DB is ready.
 */
const startServer = async () => {
  if (server) {
    console.warn('Server is already running.');
    return server;
  }
  if (isStarting) {
    console.warn('Server startup is already in progress.');
    return null;
  }
  isStarting = true;

  try {
    // 1. Establish database connection before starting HTTP server
    await connectDB();

    // 2. Start Express server only after DB is connected
    server = app.listen(config.port, () => {
      console.log(
        `Research Agent Arena Server running on port ${config.port} [${config.nodeEnv}]`
      );
      isStarting = false;
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection: ${err.message}`);
      if (server) {
        server.close(() => process.exit(1));
      } else {
        process.exit(1);
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error(`Uncaught Exception: ${err.message}`);
      if (server) {
        server.close(() => process.exit(1));
      } else {
        process.exit(1);
      }
    });

    // Register process termination signal handlers
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    return server;
  } catch (err) {
    isStarting = false;
    console.error(`Server startup failed: ${err.message}`);
    process.exit(1);
  }
};

// Start the server when executed directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer, gracefulShutdown };


