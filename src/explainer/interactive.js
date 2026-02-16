/**
 * explainer/interactive.js
 *
 * Minimal interactive UI for error explanations
 */

const chalk = require('chalk');
const readline = require('readline');
const { explain } = require('./index');

// Global state for cancellation
let cancelPrompt = false;
let activePromptResolver = null;

async function showInteractiveExplainer(errorText, config) {
  // Reset cancel flag
  cancelPrompt = false;

  console.log('\n');
  const summary = (errorText || '').toString().split('\n')[0] || 'Unknown error';

  // Header with soft border
  console.log(chalk.hex('#FF5F5F')('  ┌' + '─'.repeat(58)));
  console.log(chalk.hex('#FF5F5F')('  │ ') + chalk.white.bold('CRASH DETECTED'));
  console.log(chalk.hex('#FF5F5F')('  └' + '─'.repeat(58)));
  console.log();
  console.log(chalk.white('    ' + summary));
  console.log();

  const answer = await getUserInput();

  if (answer === 'yes') {
    await explainErrorInteractively(errorText, config);
  } else if (answer === 'cancelled') {
    // Silently skip on cancellation
  } else {
    console.log(chalk.gray('    Skipped.\n'));
  }
}

async function getUserInput() {
  return new Promise((resolve) => {
    const options = [
      { label: chalk.green('✓ Yes, explain it'), value: 'yes' },
      { label: chalk.gray('✗ No, just skip'), value: 'no' }
    ];

    let selectedIndex = 0;
    let isResolved = false;

    // Store resolver for cancellation
    activePromptResolver = () => {
      if (!isResolved) {
        cleanup();
        isResolved = true;
        resolve('cancelled');
      }
    };

    // Display the question
    console.log(chalk.cyan('    ? ') + chalk.white('Would you like an AI explanation?'));

    const renderOptions = () => {
      options.forEach((option, index) => {
        const prefix = index === selectedIndex ? chalk.cyan('❯ ') : '  ';
        console.log(`    ${prefix}${option.label}`);
      });
    };

    const cleanup = () => {
      process.stdin.removeListener('keypress', onKeypress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
      activePromptResolver = null;
    };

    // Initial render
    renderOptions();

    // Setup readline for keypress
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    const onKeypress = (str, key) => {
      // Check if cancelled
      if (cancelPrompt) {
        cleanup();
        if (!isResolved) {
          isResolved = true;
          console.log(chalk.yellow('\n    (Skipped due to restart)\n'));
          resolve('cancelled');
        }
        return;
      }

      if (key.name === 'up') {
        // Clear previous options
        process.stdout.write('\x1b[' + options.length + 'A'); // Move cursor up
        process.stdout.write('\x1b[0J'); // Clear from cursor down

        selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
        renderOptions();
      } else if (key.name === 'down') {
        // Clear previous options
        process.stdout.write('\x1b[' + options.length + 'A'); // Move cursor up
        process.stdout.write('\x1b[0J'); // Clear from cursor down

        selectedIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
        renderOptions();
      } else if (key.name === 'return') {
        cleanup();
        if (!isResolved) {
          isResolved = true;
          console.log(); // Add newline after selection
          resolve(options[selectedIndex].value);
        }
      } else if (key.ctrl && key.name === 'c') {
        cleanup();
        process.exit(0);
      }
    };

    process.stdin.on('keypress', onKeypress);
    process.stdin.resume();
  });
}

function showThinking() {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let frameIndex = 0;

  process.stdout.write('\n');
  const interval = setInterval(() => {
    process.stdout.write(`\r    ${chalk.hex('#00D7FF')(frames[frameIndex])} ${chalk.gray('Consulting Gemini...')}`);
    frameIndex = (frameIndex + 1) % frames.length;
  }, 80);

  return interval;
}

function clearThinking(interval) {
  clearInterval(interval);
  process.stdout.write('\r' + ' '.repeat(50) + '\r');
}

/**
 * Cancel any active prompt
 */
function cancelActivePrompt() {
  cancelPrompt = true;
  if (activePromptResolver) {
    activePromptResolver();
  }
}

function displayExplanation(explanation) {
  console.log('\n');

  // Minimalist header with a simple horizontal rule
  console.log(chalk.hex('#00FF87').bold('  ✦ GEMINI INTELLIGENCE'));
  console.log(chalk.gray('  ' + '─'.repeat(45)));
  console.log();

  const lines = explanation.split('\n');
  lines.forEach((line) => {
    let content = line.trim();
    if (!content) {
      console.log(); // Add a gap for empty lines (double-spacing)
      return;
    }

    // High-end minimalist styling
    // If it starts with a keyword, add a line break before it to create gaps between sections
    if (/^(Summary|Problem|Cause|Solution|Fix|Where|Why|File|Line|Note|Suggestion|Minimal code fix|Code):/i.test(content)) {
      console.log();
    }

    content = content
      .replace(/^(Summary|Problem|Cause|Solution|Fix|Where|Why|File|Line|Note|Suggestion|Minimal code fix|Code):/i, (match) => chalk.hex('#FFAF00').bold(match))
      .replace(/`([^`]+)`/g, (match) => chalk.hex('#00FF87')(match))
      .replace(/'([^']+)'/g, (match) => chalk.hex('#00FF87')(match));

    console.log('    ' + content);
  });

  console.log('\n');
}

async function explainErrorInteractively(errorText, config) {
  let thinkingInterval = showThinking();

  try {
    const explanation = await explain(errorText, config);
    clearThinking(thinkingInterval);
    displayExplanation(explanation);
  } catch (error) {
    clearThinking(thinkingInterval);
    console.log(chalk.red.bold('  ✗ Failed to explain'));
    console.log(chalk.red(`  ${error.message}`));
    console.log();
  }
}

module.exports = {
  showInteractiveExplainer,
  displayExplanation,
  cancelActivePrompt
};
