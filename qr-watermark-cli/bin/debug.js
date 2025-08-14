#!/usr/bin/env node

console.log('Current working directory:', process.cwd());
console.log('Script directory:', __dirname);
console.log('Attempting to load watermarker module...');

try {
  const { generateWatermarkedQR } = require('./src/watermarker');
  console.log('Module loaded successfully!');
} catch (error) {
  console.error('Error loading module:', error.message);
  console.error('Error stack:', error.stack);
}