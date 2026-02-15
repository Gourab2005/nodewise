// examples/express-with-errors.js
// Node.js app with integrated error handling for nodewise
// This app demonstrates how runtime errors are caught and explained

const errorWrapper = require('../src/errorWrapper');

// Setup error handlers if running under nodewise
if (process.env.NODEWISE_ACTIVE) {
  errorWrapper.setupErrorHandlers();
}

// Simulate a server with runtime error handling
const http = require('http');

const server = http.createServer((req, res) => {
  // Route 1: TypeError
  if (req.url === '/error1') {
    const obj = null;
    obj.method(); // TypeError: Cannot read property 'method' of null
    return;
  }

  // Route 2: ReferenceError
  if (req.url === '/error2') {
    console.log(undefinedVariable); // ReferenceError
    return;
  }

  // Route 3: JSON parsing error
  if (req.url === '/error3') {
    const json = '{ invalid json }';
    const parsed = JSON.parse(json); // SyntaxError
    return;
  }

  // Route 4: Working route
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Node.js app running with nodewise error handling',
      routes: [
        'GET / - this page',
        'GET /error1 - TypeError',
        'GET /error2 - ReferenceError',
        'GET /error3 - JSON SyntaxError'
      ]
    }));
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n✓ Server running at http://localhost:${PORT}`);
  console.log('\nTry these URLs to trigger errors:');
  console.log(`  curl http://localhost:${PORT}/error1  (TypeError)`);
  console.log(`  curl http://localhost:${PORT}/error2  (ReferenceError)`);
  console.log(`  curl http://localhost:${PORT}/error3  (SyntaxError)\n`);
});

