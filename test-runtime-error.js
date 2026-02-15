// test-runtime-error.js
// Simple test to verify runtime error catching

const errorWrapper = require('./src/errorWrapper');

// Setup error handlers
if (process.env.NODEWISE_ACTIVE) {
  errorWrapper.setupErrorHandlers();
}

console.log('App started...');

// Simulate a runtime error after a short delay
setTimeout(() => {
  console.log('Triggering runtime error...');
  const obj = null;
  obj.method(); // This will trigger a TypeError
}, 500);
