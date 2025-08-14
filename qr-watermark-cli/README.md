# QR Watermark Generator

A powerful command-line tool and Node.js library for generating watermarked QR codes with customizable positioning, transparency, and sizing options.

![npm](https://img.shields.io/npm/v/qr-watermark-generator)
![license](https://img.shields.io/npm/l/qr-watermark-generator)
![downloads](https://img.shields.io/npm/dt/qr-watermark-generator)

## Features

- Generate QR codes from any text or URL
- Add watermarks to your QR codes
- Customize watermark position, transparency, and size
- Use from command line or programmatically
- No external dependencies (pure Node.js)
- Supports multiple image formats (PNG, JPEG, BMP, TIFF, GIF)

## Installation

```bash
npm install -g qr-watermark-generator
```

## Quick Start

### Generate a simple QR code:
```bash
qr-watermarker "https://example.com"
```

### Generate a QR code with a watermark:
```bash
qr-watermarker "https://example.com" -w ./logo.png
```

## CLI Usage

### Basic Syntax
```bash
qr-watermarker <data> [options]
```

### Examples

```bash
# Simple QR code
qr-watermarker "Hello World"

# QR code with watermark
qr-watermarker "https://example.com" -w ./logo.png

# Customized QR code
qr-watermarker "https://example.com" \\
  -w ./logo.png \\
  -p bottom-right \\
  -t 200 \\
  -s 25 \\
  -q 1024 \\
  -o my-custom-qr.png
```

## Programmatic Usage

```javascript
const { generateWatermarkedQR } = require('qr-watermark-generator');

const buffer = await generateWatermarkedQR({
  data: 'https://example.com',
  watermarkPath: './logo.png',
  position: 'center',
  transparency: 128,
  scale: 25,
  qrSize: 512
});

// Save to file
require('fs').writeFileSync('output.png', buffer);
```

## Options

| Option | Shorthand | Default | Description |
|--------|-----------|---------|-------------|
| `<data>` | - | Required | Data to encode in QR code |
| `--watermark <path>` | `-w` | None | Path to watermark image |
| `--position <position>` | `-p` | `center` | Watermark position |
| `--transparency <number>` | `-t` | `128` | Watermark transparency (0-255) |
| `--scale <number>` | `-s` | `25` | Watermark size % (5-30) |
| `--output <path>` | `-o` | `./watermarked_qr.png` | Output file path |
| `--qr-size <number>` | `-q` | `512` | QR code size in pixels |

## License

MIT