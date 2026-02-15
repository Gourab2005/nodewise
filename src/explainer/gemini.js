/**
 * explainer/gemini.js
 * 
 * Gemini AI explainer - Uses Google Generative AI (Gemini)
 * Sends errors to Google Gemini API for intelligent AI-powered explanations
 * 
 * API Documentation: https://ai.google.dev/tutorials/rest_quickstart
 * Model: gemini-1.5-flash (fast, efficient model)
 */

const axios = require('axios');

/**
 * Default Gemini API endpoint - no need to change unless using custom proxy
 */
const DEFAULT_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Clean markdown formatting from text
 * Removes ###, **, `, etc to get plain text
 */
function cleanMarkdown(text) {
  return text
    // Remove markdown headings: ###, ##, #
    .replace(/^#+\s+/gm, '')
    // Remove bold: **text** → text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Remove italic: *text* or _text_
    .replace(/[*_]([^*_]+)[*_]/g, '$1')
    // Remove inline code: `text` → text
    .replace(/`([^`]+)`/g, '$1')
    // Remove code blocks: ```...``` 
    .replace(/```[\s\S]*?```/g, '')
    // Remove links: [text](url) → text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove multiple spaces, leading/trailing
    .trim()
    // Clean up extra blank lines
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');
}

/**
 * Create the prompt for Gemini - concise, focused on solutions, plain text
 */
function createSystemPrompt() {
  return `You are a Node.js debugging assistant. Answer in plain text only. No markdown.`;
}

/**
 * Truncate error text to a small, focused snippet to save tokens
 */
function truncateError(text, maxLines = 6, maxChars = 800) {

  function truncateString(s, max = 1000) {
    if (!s) return '';
    const str = typeof s === 'string' ? s : JSON.stringify(s);
    if (str.length <= max) return str;
    return str.slice(0, max) + '... (truncated)';
  }
  if (!text) return '';
  const cleaned = text.toString().trim();
  const lines = cleaned.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const selected = lines.slice(0, maxLines);
  let out = selected.join('\n');
  if (out.length > maxChars) out = out.slice(0, maxChars) + '... (truncated)';
  if (lines.length > maxLines && out.indexOf('...') === -1) out += '\n... (truncated)';
  return out;
}

/**
 * Explain error using Gemini API
 * 
 * @param {string} errorText - The error message/stack trace
 * @param {object} geminiConfig - Configuration object with { apiKey: 'your-api-key' }
 * @returns {Promise<string>} - The explanation with problem analysis and exact solution
 * 
 * Example:
 *   const config = { apiKey: 'AIzaSy...' }
 *   const explanation = await explainWithGemini('TypeError: Cannot read property', config)
 */
async function explainWithGemini(errorText, geminiConfig) {
  // Validate API key is provided
  if (!geminiConfig || !geminiConfig.apiKey) {
    throw new Error('Gemini API key not configured. Run: nodewise --setup');
  }

  const apiKey = geminiConfig.apiKey.trim();

  try {
    // Build the full API URL with just the API key
    const url = `${DEFAULT_ENDPOINT}?key=${apiKey}`;

    // Exact structure matching the curl example you provided
    // Minimal, token-efficient prompt — send a truncated error to reduce tokens
    const snippet = truncateError(errorText, 6, 800);
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `${createSystemPrompt()}\n\nBriefly explain the error in plain text: one-line summary; cause; file:line to change; minimal code fix.\n\nError snippet:\n${snippet}`
            }
          ]
        }
      ]
    };

    // Make the exact same request structure as shown in curl
    const response = await axios.post(url, payload, {
      timeout: geminiConfig.timeout || 60000,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey  // Also send as header (optional but explicit)
      }
    });

    // Extract explanation from Gemini response
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      let explanation = response.data.candidates[0].content.parts[0].text.trim();
      // Clean any markdown formatting that might have been included
      explanation = cleanMarkdown(explanation);
      return explanation;
    }

    throw new Error('Empty response from Gemini API');
  } catch (error) {
    // Log detailed info to stderr for debugging (without exposing API key)
    try {
      const resp = error.response;
      const cfg = error.config || {};
      const reqBody = cfg.data || payload || {};
      const respBody = resp?.data;

      const logLines = [];
      logLines.push('--- Gemini request failed (debug) ---');
      if (resp) logLines.push(`Status: ${resp.status} ${resp.statusText || ''}`);
      if (error.code) logLines.push(`Error code: ${error.code}`);
      logLines.push('Request snippet:');
      // show only the text portion of the payload to save tokens
      const textPart = (reqBody && reqBody.contents && reqBody.contents[0] && reqBody.contents[0].parts && reqBody.contents[0].parts[0] && reqBody.contents[0].parts[0].text) ? reqBody.contents[0].parts[0].text : truncateString(reqBody, 600);
      logLines.push(truncateString(textPart, 1000));
      if (respBody) {
        logLines.push('Response (truncated):');
        logLines.push(truncateString(respBody, 1000));
      }

      // Provide a curl equivalent without the API key value
      const curl = `curl "${DEFAULT_ENDPOINT}" \\
  -H "x-goog-api-key: $GEMINI_API_KEY" \\
  -H 'Content-Type: application/json' \\
  -X POST \\
  -d '${truncateString(reqBody, 1000)}'`;
      logLines.push('Curl (use env var GEMINI_API_KEY):');
      logLines.push(curl);

      // Print to stderr so normal output stays clean
      console.error('\n' + logLines.join('\n') + '\n');
    } catch (logErr) {
      // ignore logging errors
    }
    // Provide helpful error messages for common issues
    // Short, plain fallback errors (keeps CLI concise)
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Gemini API Key Error: invalid or expired key');
    }

    if (error.response?.status === 429) {
      throw new Error('Gemini rate limit (429)');
    }

    if (error.response?.status === 503 || error.response?.status === 500) {
      throw new Error('Gemini service unavailable');
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new Error('Network error: cannot reach Gemini');
    }

    if (error.code === 'ETIMEDOUT' || error.code === 'EHOSTUNREACH') {
      throw new Error('Timeout: Gemini did not respond');
    }

    // Generic fallback
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}

/**
 * Get API key setup instructions
 */
function getSetupInstructions() {
  return `
🔑 Gemini API Setup:
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the API key
4. Paste when prompted: nodewise --setup

That's it! You only need to provide the API key.
The endpoint is automatically configured.
  `;
}

module.exports = {
  explainWithGemini,
  createSystemPrompt,
  cleanMarkdown,
  getSetupInstructions,
  DEFAULT_ENDPOINT
};
