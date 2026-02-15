// examples/module-not-found.js
// This file demonstrates a MODULE_NOT_FOUND error

console.log('Starting app...');

// Try to require a non-existent module
const nonExistent = require('./this-file-does-not-exist.js');

console.log('This will not run');
