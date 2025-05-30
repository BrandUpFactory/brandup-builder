/**
 * Social Proof Section Utility Runner
 * 
 * This script provides a simple command-line interface to run the social proof utility functions.
 * Run with: node run_social_proof_utils.js [command]
 * 
 * Available commands:
 * - cleanup: Clean up duplicate code and fix avatar image references
 * - revert: Revert changes and restore simple background toggle
 * - update: Update with color picker including opacity control
 */

const { cleanupSocialProof, revertChanges, updateColorPicker } = require('./social_proof_utils');

// Get the command from command line arguments
const command = process.argv[2];

if (!command) {
  console.log('Please provide a command: cleanup, revert, or update');
  process.exit(1);
}

switch (command.toLowerCase()) {
  case 'cleanup':
    console.log('Running cleanup...');
    cleanupSocialProof();
    break;
  case 'revert':
    console.log('Reverting changes...');
    revertChanges();
    break;
  case 'update':
    console.log('Updating with color picker...');
    updateColorPicker();
    break;
  default:
    console.log('Unknown command. Available commands: cleanup, revert, update');
    process.exit(1);
}