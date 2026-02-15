// test-explainer.js
// Simple test to verify error explanation works

const { explain } = require('./src/explainer');

async function test() {
  // Test error texts
  const testErrors = [
    {
      name: 'MODULE_NOT_FOUND',
      text: 'Error: Cannot find module \'./config\''
    },
    {
      name: 'REFERENCE_ERROR', 
      text: 'ReferenceError: undefinedVariable is not defined'
    },
    {
      name: 'TYPE_ERROR',
      text: 'TypeError: Cannot read property \'method\' of null'
    }
  ];

  const config = {
    mode: 'normal',
    gemini: {}
  };

  console.log('Testing error explanations...\n');

  for (const { name, text } of testErrors) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test: ${name}`);
    console.log('='.repeat(60));
    console.log(`\nError: ${text}`);
    
    try {
      const explanation = await explain(text, config);
      console.log(`\nExplanation:\n${explanation}`);
    } catch (error) {
      console.error(`Failed: ${error.message}`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('All tests completed!');
  console.log('='.repeat(60));
}

test().catch(console.error);
