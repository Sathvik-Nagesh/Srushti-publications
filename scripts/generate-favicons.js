const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'logo.jpg');

async function generateFavicons() {
  console.log('Generating favicons from logo.jpg...');

  // Generate favicon-32x32.png
  await sharp(logoPath)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('✅ favicon-32x32.png');

  // Generate favicon-16x16.png
  await sharp(logoPath)
    .resize(16, 16, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log('✅ favicon-16x16.png');

  // Generate apple-touch-icon.png (180x180)
  await sharp(logoPath)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✅ apple-touch-icon.png');

  // Generate icon-192x192.png for PWA
  await sharp(logoPath)
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'icon-192x192.png'));
  console.log('✅ icon-192x192.png');

  // Generate icon-512x512.png for PWA
  await sharp(logoPath)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'icon-512x512.png'));
  console.log('✅ icon-512x512.png');

  // Generate favicon.ico (32x32 as PNG, named .ico - browsers accept this)
  // For a true ICO, we use the 32x32 PNG and copy it
  const favicon32Buffer = await sharp(logoPath)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32Buffer);
  console.log('✅ favicon.ico');

  console.log('\nAll favicons generated successfully!');
}

generateFavicons().catch(console.error);
