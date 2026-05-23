#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');

const sourceImage = path.join(__dirname, '../public/images/portfolio/10.JPG');
const appleIconPath = path.join(__dirname, '../public/apple-touch-icon.png');

async function generateIcon() {
  try {
    console.log('Generating Apple touch icon...');

    // Generate Apple touch icon (180x180)
    await sharp(sourceImage)
      .resize(180, 180, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(appleIconPath);

    console.log(`✓ Apple touch icon created: ${appleIconPath}`);
  } catch (error) {
    console.error('Error generating icon:', error);
    process.exit(1);
  }
}

generateIcon();
