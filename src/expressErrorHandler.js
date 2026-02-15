/**
 * expressErrorHandler.js
 * 
 * Express error handling for nodewise
 * Provides utilities to ensure all errors are logged to stderr where nodewise can catch them
 */

/**
 * Error handler middleware for Express
 * Place this AFTER all other middleware and route handlers
 * 
 * Example:
 *   const app = express();
 *   app.get('/', (req, res) => { ... });
 *   app.use(nodewiseErrorHandler);  // <-- Add at the end
 *   app.listen(3000);
 */
function nodewiseErrorHandler(err, req, res, next) {
  // Always log errors to stderr so nodewise captures them
  console.error('Caught Error in Express:');
  console.error(err.stack || err.toString());
  
  // Send response to client
  res.status(err.status || 500).json({
    error: err.message,
    status: err.status || 500
  });
}

/**
 * Wrapper to catch errors in async route handlers
 * Use this to wrap async route handlers to catch thrown errors
 * 
 * Example:
 *   app.get('/', asyncHandler(async (req, res) => {
 *     const data = await risky();
 *     res.send(data);
 *   }));
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Setup global uncaught error handlers
 * Call this at app startup to catch all unhandled errors
 */
function setupGlobalErrorHandlers() {
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:');
    console.error(err.stack || err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:');
    console.error(reason);
    process.exit(1);
  });
}

module.exports = {
  nodewiseErrorHandler,
  asyncHandler,
  setupGlobalErrorHandlers
};
