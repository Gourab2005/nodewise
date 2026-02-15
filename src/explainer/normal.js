/**
 * explainer/normal.js
 * 
 * Normal mode explainer using pattern-based detection
 * Lightweight, offline, no API calls required
 */

const { getErrorExplanation } = require('../errorPatterns');

/**
 * Explain error using pattern matching
 * 
 * @param {string} errorText - The error message/stack
 * @returns {Promise<string>} - The explanation
 */
async function explainWithNormal(errorText) {
  try {
    const explanation = getErrorExplanation(errorText);
    return explanation;
  } catch (error) {
    return `Unable to explain this error. Here's what we know:\n${errorText}`;
  }
}

module.exports = {
  explainWithNormal
};
