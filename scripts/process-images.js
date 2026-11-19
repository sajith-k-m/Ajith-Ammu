const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainUploaded = 'C:/Users/SAJITH K M/.gemini/antigravity/brain/4a28ba51-e164-4fac-aa28-40f1cf99d86a/.user_uploaded';

const sourceFiles = {
  paper: path.join(brainUploaded, 'media_1795082029043_454474ab.webp'),
  rod: path.join(brainUploaded, 'media_1795082067720_6f406b9f.webp'),
  rolled: path.join(brainUploaded, 'media_1795082079648_1f876284.png')
};

const imagesDir = path.join(__dirname, '..', 'src', 'assets', 'images');
const backupDir = path.join(imagesDir, 'backup');

fs.mkdirSync(backupDir, { recursive: true });

async function process() {
  console.log('--- Processing Images ---');
  for (const [key, srcPath] of Object.entries(sourceFiles)) {
    const filename = `${key}.webp`;
    const backupPath = path.join(backupDir, filename);
    const destPath = path.join(imagesDir, filename);

    // First save original to backup as webp
    const inputMeta = await sharp(srcPath).metadata();
    console.log(`Original ${key}: format=${inputMeta.format}, size=${inputMeta.width}x${inputMeta.height}`);
    
    // Save backup original
    await sharp(srcPath)
      .webp({ quality: 100, lossless: true })
      .toFile(backupPath);

    // Trim transparent padding and save back at quality 80, alpha preserved
    const trimmedPipeline = sharp(srcPath)
      .trim({
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        threshold: 10
      })
      .webp({
        quality: 80,
        alphaQuality: 80,
        lossless: false,
        effort: 6
      });

    const info = await trimmedPipeline.toFile(destPath);
    console.log(`Trimmed ${key}: size=${info.width}x${info.height}, bytes=${info.size}`);
  }
}

process().catch(err => {
  console.error(err);
  process.exit(1);
});
