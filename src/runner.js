/**
 * runner.js
 * 
 * Process runner and watcher
 * - Spawns child process
 * - Captures stderr for errors
 * - Watches files for changes
 * - Restarts on change
 */

const { spawn } = require('child_process');
const chokidar = require('chokidar');
const chalk = require('chalk');
const { explain } = require('./explainer');
const { showInteractiveExplainer } = require('./explainer/interactive');

class Runner {
  constructor(scriptPath, args = [], config = {}) {
    this.scriptPath = scriptPath;
    this.args = args;
    this.config = config;
    this.child = null;
    this.watcher = null;
    this.isRestarting = false;
    this.lastErrorExplanationTime = 0;
    this.isProcessExiting = false;
    this.ignorePatterns = config.ignorePatterns || ['node_modules', '.git', '.env'];
  }

  /**
   * Start the process
   */
  start() {
    if (this.child) {
      this.stop();
    }

    console.log(chalk.blue(`\n▶ Starting: ${this.scriptPath}\n`));

    // Set environment variable to indicate nodewise is active
    const env = {
      ...process.env,
      NODEWISE_ACTIVE: 'true'
    };

    this.child = spawn('node', [this.scriptPath, ...this.args], {
      stdio: ['inherit', 'pipe', 'pipe'],  // Capture both stdout and stderr
      env: env
    });

    // Capture both stderr and stdout for errors
    let errorBuffer = '';
    let lastErrorTime = 0;

    // Capture stderr
    this.child.stderr.on('data', (data) => {
      const text = data.toString();
      process.stderr.write(text);
      errorBuffer += text;
      
      // Detect errors in stderr and explain them immediately
      if (this.isErrorOutput(text)) {
        this.explainErrorWithDebounce(text);
        errorBuffer = ''; // Reset buffer after explanation
      }
    });

    // Also capture stdout for runtime errors that get logged
    this.child.stdout.on('data', (data) => {
      const text = data.toString();
      process.stdout.write(text);
      // Check if this looks like an error logged to stdout
      if (this.isErrorOutput(text)) {
        errorBuffer += text;
        // Detect errors in stdout and explain them immediately
        this.explainErrorWithDebounce(text);
        errorBuffer = ''; // Reset buffer after explanation
      }
    });

    this.child.on('error', (err) => {
      console.error(chalk.red(`\n✗ Error spawning process: ${err.message}\n`));
      this.handleError(errorBuffer);
    });

    this.child.on('exit', (code, signal) => {
      this.isProcessExiting = true;
      
      if (code !== 0 && code !== null) {
        // Process exited with error
        if (!this.isRestarting && errorBuffer) {
          this.handleError(errorBuffer);
        }
      } else if (signal) {
        console.log(chalk.yellow(`\nProcess terminated by signal ${signal}\n`));
      }

      this.child = null;
      errorBuffer = '';
      this.isProcessExiting = false;
    });

    // Watch for file changes
    this.setupWatcher();
  }

  /**
   * Handle error with interactive explanation
   */
  async handleError(errorText) {
    if (!errorText) return;
    await showInteractiveExplainer(errorText, this.config);
  }

  /**
   * Setup file watcher
   */
  setupWatcher() {
    if (this.watcher) {
      this.watcher.close();
    }

    const watchPatterns = [
      '**/*.js',
      '**/*.json',
      '!node_modules/**',
      '!.git/**'
    ];

    this.watcher = chokidar.watch(watchPatterns, {
      ignored: this.ignorePatterns,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100
      }
    });

    this.watcher.on('change', (path) => {
      this.restart(`File changed: ${path}`);
    });
  }

  /**
   * Restart the process
   */
  restart(reason = '') {
    if (this.isRestarting) return;

    this.isRestarting = true;

    if (this.child) {
      this.child.kill('SIGTERM');
      
      // Wait a bit for graceful shutdown
      setTimeout(() => {
        if (this.child && !this.child.killed) {
          this.child.kill('SIGKILL');
        }
        
        setTimeout(() => {
          this.isRestarting = false;
          if (reason) {
            console.log(chalk.yellow(`\n↻ Restarting... (${reason})\n`));
          }
          this.start();
        }, 100);
      }, 500);
    } else {
      this.isRestarting = false;
      this.start();
    }
  }

  /**
   * Stop the process and watcher
   */
  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }

    if (this.child) {
      this.child.kill('SIGTERM');
      this.child = null;
    }
  }

  /**
   * Handle graceful shutdown
   */
  handleShutdown() {
    console.log(chalk.yellow('\nShutting down nodewise...\n'));
    this.stop();
    process.exit(0);
  }

  /**
   * Check if output contains error indicators
   */
  isErrorOutput(text) {
    const errorPatterns = [
      /error:/i,
      /Error\:/i,
      /TypeError/i,
      /ReferenceError/i,
      /SyntaxError/i,
      /warning:/i,
      /failed/i,
      /throw/i,
      /stack trace/i,
      /traceback/i,
      /exception/i,
      /crash/i,
      /fatal/i
    ];

    return errorPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Explain error with debouncing to avoid duplicate explanations
   */
  async explainErrorWithDebounce(errorText) {
    const now = Date.now();
    // Debounce: only explain if at least 500ms has passed since last error
    if (this.lastErrorExplanationTime && (now - this.lastErrorExplanationTime) < 500) {
      return;
    }
    this.lastErrorExplanationTime = now;
    
    // Don't explain startup errors that already caused process exit
    if (this.isProcessExiting) {
      return;
    }

    await showInteractiveExplainer(errorText, this.config);
  }
}

module.exports = {
  Runner
};
