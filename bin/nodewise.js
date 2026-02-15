#!/usr/bin/env node

/**
 * bin/nodewise.js
 * 
 * CLI entry point
 * Handles command-line arguments and orchestrates the setup/run flow
 */

const chalk = require('chalk');
const path = require('path');
const config = require('../src/config');
const { runSetup } = require('../src/setup');
const { Runner } = require('../src/runner');

const VERSION = '1.0.0';

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {
    help: false,
    version: false,
    setup: false,
    reset: false
  };
  
  let scriptPath = null;
  const scriptArgs = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      flags.help = true;
    } else if (arg === '--version' || arg === '-v') {
      flags.version = true;
    } else if (arg === '--setup') {
      flags.setup = true;
    } else if (arg === '--reset') {
      flags.reset = true;
    } else if (!scriptPath) {
      scriptPath = arg;
    } else {
      scriptArgs.push(arg);
    }
  }

  return { flags, scriptPath, scriptArgs };
}

/**
 * Display help message
 */
function showHelp() {
  console.log(`
${chalk.cyan.bold('nodewise ' + VERSION)} ${chalk.gray('- Node.js error explainer with AI-powered clarity')}

${chalk.bold('USAGE')}
  npx nodewise [options] <script> [script-args]

${chalk.bold('OPTIONS')}
  -h, --help          Show this help message
  -v, --version       Show version
  --setup             Run setup wizard
  --reset             Reset configuration

${chalk.bold('EXAMPLES')}
  npx nodewise app.js
  npx nodewise server.js --port 3000
  npx nodewise --setup       (configure explanation mode)
  npx nodewise --reset       (reset configuration)

${chalk.bold('MODES')}
  ${chalk.cyan('Gemini Explainer')}      - AI-powered error explanations using Google Gemini
  ${chalk.cyan('Normal Detection')}      - Pattern-based error detection (offline)

${chalk.bold('CONFIGURATION')}
  Settings are saved in ${chalk.yellow('nodewise.config.json')} in your project root.

${chalk.bold('DOCUMENTATION')}
  https://github.com/yourusername/nodewise
  `);
}

/**
 * Display version
 */
function showVersion() {
  console.log(`nodewise ${VERSION}`);
}

/**
 * Main CLI function
 */
async function main() {
  const { flags, scriptPath, scriptArgs } = parseArgs();

  // Handle info flags
  if (flags.help) {
    showHelp();
    process.exit(0);
  }

  if (flags.version) {
    showVersion();
    process.exit(0);
  }

  // Handle setup flow
  if (flags.setup || flags.reset) {
    try {
      await runSetup();
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Setup failed:'), error.message);
      process.exit(1);
    }
  }

  // Check if script path is provided
  if (!scriptPath) {
    console.error(chalk.red('Error: Please provide a script to run\n'));
    showHelp();
    process.exit(1);
  }

  // Resolve script path
  const resolvedScriptPath = path.resolve(process.cwd(), scriptPath);

  try {
    // Load or create configuration
    let appConfig = config.loadConfig();

    if (!appConfig) {
      console.log(chalk.cyan('No configuration found. Running setup wizard...\n'));
      appConfig = await runSetup();
    }

    // Start the runner
    const runner = new Runner(resolvedScriptPath, scriptArgs, appConfig);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      runner.handleShutdown();
    });

    process.on('SIGTERM', () => {
      runner.handleShutdown();
    });

    // Start running
    runner.start();
  } catch (error) {
    console.error(chalk.red('Fatal error:'), error.message);
    process.exit(1);
  }
}

// Run the CLI
main().catch((error) => {
  console.error(chalk.red('Unexpected error:'), error);
  process.exit(1);
});
