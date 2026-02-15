/**
 * index.js
 * 
 * Main entry point for nodewise
 * Exports the Runner class for programmatic use
 */

const { Runner } = require('./runner');
const { explain } = require('./explainer');

module.exports = {
  Runner,
  explain
};
