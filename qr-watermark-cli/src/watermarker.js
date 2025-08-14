const QRCode = require('qrcode');
const Jimp = require('jimp');

/**
 * Generate a watermarked QR code
 * @param {Object} options - Generation options
 * @param {string} options.data - Data to encode in the QR code
 * @param {string} [options.watermarkPath] - Path to watermark image file
 * @param {string} [options.position='center'] - Watermark position (center, top-left, top-right, bottom-left, bottom-right)
 * @param {number} [options.transparency=128] - Watermark transparency (0-255)
 * @param {number} [options.scale=25] - Watermark size as percentage of QR code (5-30)
 * @param {number} [options.qrSize=512] - Base size of the QR code in pixels
 * @returns {Promise<Buffer>} - PNG image buffer of the watermarked QR code
 */
async function generateWatermarkedQR(options) {
  const {
    data,
    watermarkPath,
    position = 'center',
    transparency = 128,
    scale = 25,
    qrSize = 512
  } = options;

  // Validate inputs
  if (!data) {
    throw new Error('QR Code data is required');
  }

  // Generate QR code as buffer
  const qrBuffer = await QRCode.toBuffer(data, {
    width: qrSize,
    margin: 1,
    errorCorrectionLevel: 'H',
    type: 'image/png'
  });

  // Load QR code into Jimp
  const qrImage = await Jimp.read(qrBuffer);

  // Add watermark if provided
  if (watermarkPath) {
    try {
      const watermarkImage = await Jimp.read(watermarkPath);
      
      // Calculate watermark dimensions
      const watermarkScale = scale / 100;
      const watermarkWidth = Math.floor(qrSize * watermarkScale);
      const watermarkHeight = Math.floor((watermarkImage.bitmap.height / watermarkImage.bitmap.width) * watermarkWidth);
      const margin = Math.floor(qrSize * 0.05);

      // Resize watermark
      watermarkImage.resize(watermarkWidth, watermarkHeight);

      // Apply transparency
      // Jimp uses 0-100 for opacity where 100 is opaque
      const opacity = Math.floor((transparency / 255) * 100);
      watermarkImage.opacity(opacity / 100);

      // Calculate position
      let x = Math.floor((qrSize - watermarkWidth) / 2);
      let y = Math.floor((qrSize - watermarkHeight) / 2);

      switch (position) {
        case 'top-left':
          x = margin;
          y = margin;
          break;
        case 'top-right':
          x = qrSize - watermarkWidth - margin;
          y = margin;
          break;
        case 'bottom-left':
          x = margin;
          y = qrSize - watermarkHeight - margin;
          break;
        case 'bottom-right':
          x = qrSize - watermarkWidth - margin;
          y = qrSize - watermarkHeight - margin;
          break;
      }

      // Composite watermark onto QR code
      qrImage.composite(watermarkImage, x, y);
    } catch (err) {
      throw new Error(`Failed to load watermark image: ${err.message}`);
    }
  }

  // Return as buffer
  return await qrImage.getBufferAsync(Jimp.MIME_PNG);
}

module.exports = { generateWatermarkedQR };