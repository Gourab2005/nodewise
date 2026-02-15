/**
 * setup.js
 * 
 * Interactive setup wizard for first-time users
 * Similar to Vite's setup experience
 */

const inquirer = require('inquirer').default;
const chalk = require('chalk');
const config = require('./config');

/**
 * Run interactive setup
 */
async function runSetup() {
  console.log('\n' + chalk.cyan('┌─ Welcome to Nodewise Setup ─┐'));
  console.log(chalk.cyan('│') + 
    chalk.blue(' Node.js error explainer with AI-powered clarity') + 
    chalk.cyan('  │'));
  console.log(chalk.cyan('└────────────────────────────────┘\n'));

  // Step 1: Choose explanation mode
  const modeAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Select explanation mode:',
      choices: [
        {
          name: 'Gemini Explainer (AI-powered)',
          value: 'gemini',
          description: 'Uses Google Gemini AI to explain errors intelligently'
        },
        {
          name: 'Normal Detection (Pattern-based)',
          value: 'normal',
          description: 'Uses built-in pattern matching to explain common errors'
        }
      ],
      default: 'normal'
    }
  ]);

  let finalConfig;

  if (modeAnswer.mode === 'gemini') {
    console.log('\n' + chalk.cyan('┌─ Google Gemini Setup ─┐'));
    console.log(chalk.cyan('│'));
    console.log(chalk.cyan('│') + '  1. Visit: ' + chalk.blue('https://makersuite.google.com/app/apikey'));
    console.log(chalk.cyan('│') + '  2. Click "Create API Key"');
    console.log(chalk.cyan('│') + '  3. Copy the key and paste below');
    console.log(chalk.cyan('│'));
    console.log(chalk.cyan('└──────────────────────────────┘\n'));

    const geminiAnswers = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Paste your Gemini API Key:',
        mask: '*',
        validate: (input) => {
          const trimmed = input.trim();
          if (!trimmed || trimmed.length < 10) {
            return 'API key seems invalid (too short). Copy the full key from makersuite.google.com';
          }
          return true;
        }
      }
    ]);

    finalConfig = config.createConfig('gemini', {
      apiKey: geminiAnswers.apiKey.trim()
    });

    console.log('\n' + chalk.green('✓ Gemini configuration saved!'));
    console.log(chalk.gray('  Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'));
  } else {
    finalConfig = config.createConfig('normal');
    console.log('\n' + chalk.green('✓ Normal mode configured'));
  }

  // Display next steps
  console.log(chalk.cyan('\n┌─ Next Steps ─┐'));
  console.log(chalk.cyan('│'));
  console.log(chalk.cyan('│') + '  Run your app with nodewise:');
  console.log(chalk.cyan('│') + '  ' + chalk.yellow('npx nodewise my-app.js'));
  console.log(chalk.cyan('│'));
  console.log(chalk.cyan('│') + '  Or with arguments:');
  console.log(chalk.cyan('│') + '  ' + chalk.yellow('npx nodewise server.js --port 3000'));
  console.log(chalk.cyan('│'));
  console.log(chalk.cyan('└──────────────────────────────┘\n'));

  return finalConfig;
}

module.exports = {
  runSetup
};
