// examples/express-server.js
// Express app with integrated nodewise error handling
// This shows the correct way to set up Express for error explanation

const express = require('express');
const { nodewiseErrorHandler, asyncHandler } = require('../src/expressErrorHandler');

const app = express();

app.use(express.json());

// =========== ROUTES ===========

// Route 1: Intentional TypeError
app.get('/error1', (req, res) => {
  const obj = null;
  obj.kjbvend("Hello"); // TypeError: obj.kjbvend is not a function
  res.send('This will not run');
});

// Route 2: Intentional ReferenceError
app.get('/error2', (req, res) => {
  console.log(undefinedVar); // ReferenceError
  res.send('This will not run');
});

// Route 3: JSON parsing error
app.get('/error3', (req, res) => {
  const json = '{ invalid }';
  JSON.parse(json); // SyntaxError
  res.send('This will not run');
});

// Route 4: Async error
app.get('/error4', asyncHandler(async (req, res) => {
  // This will throw an error
  throw new Error('Async operation failed');
}));

// Route 5: Working route
app.get('/', (req, res) => {
  res.json({
    message: 'Express server with nodewise error handling',
    routes: [
      'GET / - this page',
      'GET /error1 - TypeError (obj.kjbvend)',
      'GET /error2 - ReferenceError (undefined variable)',
      'GET /error3 - JSON SyntaxError',
      'GET /error4 - Async error'
    ]
  });
});

// =========== ERROR HANDLER ===========
// THIS IS IMPORTANT: Add error handler middleware AFTER all routes
// This will catch all errors and log them to stderr where nodewise catches them
app.use(nodewiseErrorHandler);

// =========== START SERVER ===========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✓ Express server running at http://localhost:${PORT}`);
  console.log('\nTry these URLs to trigger errors:');
  console.log(`  GET http://localhost:${PORT}/error1  (TypeError)`);
  console.log(`  GET http://localhost:${PORT}/error2  (ReferenceError)`);
  console.log(`  GET http://localhost:${PORT}/error3  (SyntaxError)`);
  console.log(`  GET http://localhost:${PORT}/error4  (Async Error)\n`);
  console.log('Run nodewise to see errors explained:');
  console.log('  nodewise examples/express-server.js\n');
});
