const sharp = require('sharp');
const fs = require('fs');

const sizes = [192, 512];

async function generateIcons() {
  const svgBuffer = fs.readFileSync('./assets/icon.svg');
  
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`./assets/icon-${size}.png`);
    
    console.log(`Generated icon-${size}.png`);
  }
}

generateIcons().catch(console.error); 