// test-express-error.js
// Test runtime error catching

const http = require('http');

// Simple server
const server = http.createServer((req, res) => {
  try {
    if (req.url === '/') {
      res.writeHead(200);
      res.end('OK');
    } else if (req.url === '/error') {
      // Intentional TypeError to test
      const obj = null;
      obj.kjbvend("Hello");
    } else if (req.url === '/ref-error') {
      // Intentional ReferenceError to test
      console.log(nonexistentVariable);
    }
  } catch (err) {
    // Log error to stderr where nodewise catches it
    console.error(err.stack);
    res.writeHead(500);
    res.end('Error');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`To test: curl http://localhost:${PORT}/error`);
  console.log(`Health: curl http://localhost:${PORT}/`);
});
