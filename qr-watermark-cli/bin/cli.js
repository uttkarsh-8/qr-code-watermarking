#!/usr/bin/env node

const { Command } = require('commander');
const { generateWatermarkedQR } = require('../src/watermarker');
const fs = require('fs').promises;

const program = new Command();

program
  .name('qr-watermarker')
  .description('CLI tool to generate watermarked QR codes')
  .version('1.0.0');

program
  .argument('<data>', 'Data to encode in the QR code (URL or text)')
  .option('-w, --watermark <path>', 'Path to watermark image')
  .option('-p, --position <position>', 'Watermark position (center, top-left, top-right, bottom-left, bottom-right)', 'center')
  .option('-t, --transparency <number>', 'Watermark transparency (0-255)', '128')
  .option('-s, --scale <number>', 'Watermark size as percentage of QR code (5-30)', '25')
  .option('-o, --output <path>', 'Output file path', './watermarked_qr.png')
  .option('-q, --qr-size <number>', 'QR code size in pixels', '512')
  .action(async (data, options) => {
    try {
      console.log('Generating watermarked QR code...');
      
      const result = await generateWatermarkedQR({
        data,
        watermarkPath: options.watermark,
        position: options.position,
        transparency: parseInt(options.transparency),
        scale: parseInt(options.scale),
        qrSize: parseInt(options.qrSize)
      });

      // Save to file
      await fs.writeFile(options.output, result);
      console.log(`QR code saved to ${options.output}`);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse();