const dotenv = require('dotenv');

// Load environment variables FIRST, before any other imports
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Start the server only after a successful MongoDB connection.
 * This prevents the API from accepting requests before the DB is ready.
 */
const startServer = async () => {
  // Connect to MongoDB first
  await connectDB();

  // Start Express server only after DB is connected
  const server = app.listen(PORT, () => {
    console.log(
      `Research Agent Arena Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`
    );
  });

  // Handle unhandled promise rejections (e.g. failed DB queries after startup)
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    server.close(() => process.exit(1));
  });

  return server;
};

// Boot the application and handle startup failures gracefully
startServer().catch((err) => {
  console.error(`Server startup failed: ${err.message}`);
  process.exit(1);
});

