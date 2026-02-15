/**
 * explainer/interactive.js
 *
 * Minimal interactive UI for error explanations
 */

const chalk = require('chalk');
const readline = require('readline');
const { explain } = require('./index');

async function showInteractiveExplainer(errorText, config) {
  console.log('\n');
  const summary = (errorText || '').toString().split('\n')[0] || 'Unknown error';

  // Header with soft border
  console.log(chalk.hex('#FF5F5F')('  ┌' + '─'.repeat(58)));
  console.log(chalk.hex('#FF5F5F')('  │ ') + chalk.white.bold('CRASH DETECTED'));
  console.log(chalk.hex('#FF5F5F')('  └' + '─'.repeat(58)));
  console.log();
  console.log(chalk.white('    ' + summary));
  console.log();

  // Compact, modern prompt
  console.log(chalk.cyan.bold('    ? ') + chalk.white('Would you like an AI explanation?'));
  console.log(chalk.gray('      [y] Yes, explain it  [n] No, just skip'));
  console.log();

  const answer = await getUserInput();

  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes' || answer === '') {
    await explainErrorInteractively(errorText, config);
  } else {
    console.log(chalk.gray('    Skipped.\n'));
  }
}

function getUserInput() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });

    process.stdout.write(chalk.cyan('    > '));

    rl.on('line', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
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
    if (/^(Summary|Problem|Cause|Solution|Fix|Where|Why|File|Line|Note|Suggestion):/i.test(content)) {
      console.log();
    }

    content = content
      .replace(/^(Summary|Problem|Cause|Solution|Fix|Where|Why|File|Line|Note|Suggestion):/i, (match) => chalk.hex('#FFAF00').bold(match))
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
  displayExplanation
};
