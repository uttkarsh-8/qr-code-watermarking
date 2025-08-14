const { generateWatermarkedQR } = require('./src/watermarker');
const fs = require('fs');

async function test() {
  try {
    console.log('Testing programmatic API...');
    
    const buffer = await generateWatermarkedQR({
      data: 'https://example.com',
      watermarkPath: './test/logo.png',
      position: 'bottom-right',
      transparency: 150,
      scale: 15,
      qrSize: 512
    });

    // Save to file
    fs.writeFileSync('test/programmatic_output.png', buffer);
    console.log('Programmatic test complete. Output saved to test/programmatic_output.png');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();