/**
 * errorWrapper.js
 * 
 * Optional error wrapper that can be required in user's app
 * to ensure all runtime errors are logged to stderr where nodewise can catch them
 */

/**
 * Setup global error handlers
 * Call this at the very start of your app:
 * 
 * if (process.env.NODEWISE_ACTIVE) {
 *   require('./path/to/errorWrapper').setupErrorHandlers();
 * }
 */
function setupErrorHandlers() {
  // Catch all uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:');
    console.error(error);
    process.exit(1);
  });

  // Catch all unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
    process.exit(1);
  });

  // For Express apps - catch all errors
  if (global.app) {
    global.app.use((err, req, res, next) => {
      console.error('Express Error:');
      console.error(err);
      res.status(500).send('Server Error');
    });
  }
}

module.exports = {
  setupErrorHandlers
};
