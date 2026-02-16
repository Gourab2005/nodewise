/**
 * config.js
 * 
 * Manages nodewise configuration.
 * Handles reading, writing, and validating the nodewise.config.json file.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = 'nodewise.config.json';
const HIDDEN_CONFIG_FILE = '.nodewise.config.json';

/**
 * Get the configuration file path
 * Prioritizes node_modules to avoid accidental git commits
 */
function getConfigPath() {
  const cwd = process.cwd();
  const nodeModulesPath = path.join(cwd, 'node_modules');
  const nodeModulesConfig = path.join(nodeModulesPath, HIDDEN_CONFIG_FILE);
  const rootHiddenConfig = path.join(cwd, HIDDEN_CONFIG_FILE);
  const rootLegacyConfig = path.join(cwd, CONFIG_FILE);

  // 1. Check if config already exists in node_modules
  if (fs.existsSync(nodeModulesConfig)) {
    return nodeModulesConfig;
  }

  // 2. Check if hidden config exists in root
  if (fs.existsSync(rootHiddenConfig)) {
    return rootHiddenConfig;
  }

  // 3. Check if legacy config exists in root
  if (fs.existsSync(rootLegacyConfig)) {
    return rootLegacyConfig;
  }

  // 4. For NEW configs:
  // If node_modules exists, use it (recommended for security)
  if (fs.existsSync(nodeModulesPath)) {
    try {
      // Ensure node_modules exists (redundant but safe)
      return nodeModulesConfig;
    } catch (e) {
      // Fallback to root if node_modules is not writable
    }
  }

  // Final fallback to hidden root config
  return rootHiddenConfig;
}

/**
 * Check if config file exists
 */
function configExists() {
  return fs.existsSync(getConfigPath());
}

/**
 * Load configuration from file
 */
function loadConfig() {
  const configPath = getConfigPath();

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to parse config file: ${error.message}`);
  }
}

/**
 * Save configuration to file
 */
function saveConfig(config) {
  const configPath = getConfigPath();
  const data = JSON.stringify(config, null, 2);

  try {
    fs.writeFileSync(configPath, data, 'utf8');
    return true;
  } catch (error) {
    throw new Error(`Failed to save config file: ${error.message}`);
  }
}

/**
 * Get default configuration template
 */
function getDefaultConfig() {
  return {
    mode: 'normal',
    gemini: {
      endpoint: '',
      apiKey: ''
    },
    autoRestart: true,
    ignorePatterns: ['node_modules', '.git', '.env'],
    timeout: 60000 // 60 seconds
  };
}

/**
 * Validate configuration
 */
function validateConfig(config) {
  if (!config.mode) {
    throw new Error('Config must have a "mode" field (normal or gemini)');
  }

  if (config.mode !== 'normal' && config.mode !== 'gemini') {
    throw new Error('Mode must be either "normal" or "gemini"');
  }

  if (config.mode === 'gemini') {
    if (!config.gemini || !config.gemini.apiKey) {
      throw new Error('Gemini mode requires API key in config');
    }
  }

  return true;
}

/**
 * Merge partial config with defaults
 */
function mergeWithDefaults(partialConfig) {
  const defaults = getDefaultConfig();
  return {
    ...defaults,
    ...partialConfig,
    gemini: {
      ...defaults.gemini,
      ...partialConfig.gemini
    }
  };
}

/**
 * Create initial configuration
 */
function createConfig(mode, geminiConfig = {}) {
  const config = getDefaultConfig();
  config.mode = mode;

  if (mode === 'gemini') {
    config.gemini = {
      endpoint: geminiConfig.endpoint || '',
      apiKey: geminiConfig.apiKey || ''
    };
  }

  validateConfig(config);
  saveConfig(config);
  return config;
}

/**
 * Update existing configuration
 */
function updateConfig(updates) {
  let config = loadConfig();

  if (!config) {
    config = getDefaultConfig();
  }

  config = {
    ...config,
    ...updates,
    gemini: {
      ...config.gemini,
      ...updates.gemini
    }
  };

  validateConfig(config);
  saveConfig(config);
  return config;
}

module.exports = {
  getConfigPath,
  configExists,
  loadConfig,
  saveConfig,
  getDefaultConfig,
  validateConfig,
  mergeWithDefaults,
  createConfig,
  updateConfig,
  CONFIG_FILE,
  HIDDEN_CONFIG_FILE
};
