#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const width = 1200;
const height = 630;

async function generateCover() {
  try {
    console.log('Generating custom OG cover image...');

    // Create SVG with typography matching the site
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="#ffffff"/><text x="${width / 2}" y="280" font-family="Georgia, serif" font-size="72" font-weight="400" text-anchor="middle" fill="#0a0a0a">The Girl With A Camera</text><text x="${width / 2}" y="380" font-family="Arial, sans-serif" font-size="18" font-weight="400" text-anchor="middle" fill="#666666">Documentary Photographer and Content Creator</text><text x="${width / 2}" y="420" font-family="Arial, sans-serif" font-size="14" font-weight="400" text-anchor="middle" fill="#999999">Brussels, Belgium</text><line x1="200" y1="450" x2="1000" y2="450" stroke="#ebebeb" stroke-width="1"/></svg>`;

    // Convert SVG to image for OG
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 85, progressive: true })
      .toFile(path.join(__dirname, '../public/og-image.jpg'));

    console.log('✓ OG image created: og-image.jpg');

    // Create Twitter image (same design)
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 85, progressive: true })
      .toFile(path.join(__dirname, '../public/twitter-image.jpg'));

    console.log('✓ Twitter image created: twitter-image.jpg');

    // Create Apple icon with simplified version
    const appleIconSvg = `<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg"><rect width="180" height="180" fill="#ffffff"/><text x="90" y="95" font-family="Georgia, serif" font-size="28" font-weight="400" text-anchor="middle" dominant-baseline="central" fill="#0a0a0a">TGWAC</text></svg>`;

    await sharp(Buffer.from(appleIconSvg))
      .png()
      .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));

    console.log('✓ Apple icon created: apple-touch-icon.png');
    console.log('Done!');
  } catch (error) {
    console.error('Error generating cover:', error);
    process.exit(1);
  }
}

generateCover();
