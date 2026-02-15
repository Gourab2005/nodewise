/**
 * explainer/index.js
 * 
 * Main explainer abstraction layer
 * Routes to appropriate explainer based on configuration
 * Handles fallback from Gemini to Normal mode on failure
 */

const { explainWithGemini } = require('./gemini');
const { explainWithNormal } = require('./normal');
const chalk = require('chalk');

/**
 * Main explain function - routes based on config
 * 
 * @param {string} errorText - The error message/stack
 * @param {object} config - Configuration object with mode setting
 * @returns {Promise<string>} - The explanation
 */
async function explain(errorText, config) {
  if (!config) {
    throw new Error('Configuration is required');
  }

  // If no mode specified, default to normal
  const mode = config.mode || 'normal';

  try {
    if (mode === 'gemini') {
      try {
        const geminiOptions = { ...config.gemini, timeout: config.timeout };
        return await explainWithGemini(errorText, geminiOptions);
      } catch (geminiError) {
        // Gemini failed — fall back to normal mode (concise)
        const reason = (geminiError && geminiError.message) ? geminiError.message.split('\n')[0] : 'unknown';
        console.warn(chalk.yellow(`Gemini failed, using normal mode: ${reason}`));
        return await explainWithNormal(errorText);
      }
    } else if (mode === 'normal') {
      return await explainWithNormal(errorText);
    } else {
      throw new Error(`Unknown explanation mode: ${mode}`);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  explain
};
