// Run with: node generate-icons.js
// Generates PNG icons from SVG for PWA manifest
// Requires: npm install -g sharp (or use an online SVG-to-PNG converter)
//
// Alternative: Use https://www.pwabuilder.com/imageGenerator to upload
// public/favicon.svg and download the icon set into public/icons/

const fs = require('fs')
const path = require('path')

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#1e40af"/>
  <text x="256" y="380" font-size="340" text-anchor="middle" fill="white" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif">🗺️</text>
</svg>`

// Write the SVG icon
fs.writeFileSync(path.join(__dirname, 'public', 'icon.svg'), svgContent)
console.log('✅ Written public/icon.svg')
console.log('')
console.log('To generate PNG icons, either:')
console.log('  1. Visit https://www.pwabuilder.com/imageGenerator')
console.log('     and upload public/icon.svg')
console.log('  2. Or install sharp: npm install sharp')
console.log('     and run this script again with the sharp code uncommented')
console.log('')
console.log('Place icon-192.png and icon-512.png in public/icons/')
