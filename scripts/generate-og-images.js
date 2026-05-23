#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');

const sourceImage = path.join(__dirname, '../public/images/portfolio/10.JPG');
const ogImagePath = path.join(__dirname, '../public/og-image.jpg');
const twitterImagePath = path.join(__dirname, '../public/twitter-image.jpg');

async function generateImages() {
  try {
    console.log('Generating OG image from portfolio...');

    // Generate OG image (1200x630)
    await sharp(sourceImage)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85, progressive: true })
      .toFile(ogImagePath);

    console.log(`✓ OG image created: ${ogImagePath}`);

    // Generate Twitter image (1200x630)
    await sharp(sourceImage)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85, progressive: true })
      .toFile(twitterImagePath);

    console.log(`✓ Twitter image created: ${twitterImagePath}`);
    console.log('Done!');
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

generateImages();
