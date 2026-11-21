const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function refineAssets() {
  const imgPath = 'C:/Users/SAJITH K M/.gemini/antigravity/brain/4a28ba51-e164-4fac-aa28-40f1cf99d86a/.user_uploaded/media_1795290033227_de38935d.jpg';
  const img = sharp(imgPath);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // 1. Precise flood fill
  const isPureBg = (x, y) => {
    const idx = (y * width + x) * channels;
    return data[idx] >= 248 && data[idx + 1] >= 248 && data[idx + 2] >= 248;
  };

  const exterior = new Uint8Array(width * height);
  const q = [];

  for (let x = 0; x < width; x++) {
    if (isPureBg(x, 0)) { exterior[x] = 1; q.push(x, 0); }
    if (isPureBg(x, height - 1)) { exterior[(height - 1) * width + x] = 1; q.push(x, height - 1); }
  }
  for (let y = 0; y < height; y++) {
    if (isPureBg(0, y)) { exterior[y * width] = 1; q.push(0, y); }
    if (isPureBg(width - 1, y)) { exterior[y * width + (width - 1)] = 1; q.push(width - 1, y); }
  }

  let h = 0;
  while (h < q.length) {
    const cx = q[h++];
    const cy = q[h++];

    const nbs = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
    for (const [nx, ny] of nbs) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx;
        if (!exterior[nidx]) {
          const sidx = nidx * channels;
          const r = data[sidx], g = data[sidx + 1], b = data[sidx + 2];
          if (r >= 238 && g >= 238 && b >= 238) {
            exterior[nidx] = 1;
            q.push(nx, ny);
          }
        }
      }
    }
  }

  // Create clean master RGBA
  const masterRgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const sidx = idx * channels;
      const didx = idx * 4;

      if (exterior[idx]) {
        masterRgba[didx] = 0;
        masterRgba[didx + 1] = 0;
        masterRgba[didx + 2] = 0;
        masterRgba[didx + 3] = 0;
      } else {
        let r = data[sidx];
        let g = data[sidx + 1];
        let b = data[sidx + 2];
        let a = 255;

        // Edge defringe check
        let isEdge = false;
        if (x > 0 && exterior[idx - 1]) isEdge = true;
        else if (x < width - 1 && exterior[idx + 1]) isEdge = true;
        else if (y > 0 && exterior[idx - width]) isEdge = true;
        else if (y < height - 1 && exterior[idx + width]) isEdge = true;

        if (isEdge) {
          const lum = (r + g + b) / 3;
          if (lum > 210) {
            a = Math.max(0, Math.min(255, Math.round(255 * (1 - (lum - 210) / 45))));
            const factor = Math.max(0.15, a / 255);
            r = Math.min(255, Math.max(0, Math.round((r - (1 - factor) * 255) / factor)));
            g = Math.min(255, Math.max(0, Math.round((g - (1 - factor) * 255) / factor)));
            b = Math.min(255, Math.max(0, Math.round((b - (1 - factor) * 255) / factor)));
          }
        }

        masterRgba[didx] = r;
        masterRgba[didx + 1] = g;
        masterRgba[didx + 2] = b;
        masterRgba[didx + 3] = a;
      }
    }
  }

  const masterSharp = sharp(masterRgba, { raw: { width, height, channels: 4 } });
  const assetsDir = path.join(__dirname, '..', 'src', 'assets', 'images');

  // Upscale 2x with Lanczos3
  const scale = 2;
  const upW = width * scale;
  const upH = height * scale;

  const upscaledMaster = await masterSharp
    .resize(upW, upH, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 1.5 })
    .png()
    .toBuffer();

  // 1. Save Full Transparent Scroll
  await sharp(upscaledMaster)
    .webp({ quality: 95 })
    .toFile(path.join(assetsDir, 'scroll-full.webp'));

  // 2. Extract Top Rod (Y from 30 to 115)
  const topY = 28 * scale;
  const topH = (115 - 28) * scale;
  await sharp(upscaledMaster)
    .extract({ left: 0, top: topY, width: upW, height: topH })
    .webp({ quality: 95 })
    .toFile(path.join(assetsDir, 'scroll-rod-top.webp'));

  // 3. Extract Bottom Rod (Y from 572 to 650)
  const botY = 572 * scale;
  const botH = (652 - 572) * scale;
  await sharp(upscaledMaster)
    .extract({ left: 0, top: botY, width: upW, height: botH })
    .webp({ quality: 95 })
    .toFile(path.join(assetsDir, 'scroll-rod-bottom.webp'));

  // 4. Extract Parchment Paper Body (Y from 115 to 572, X from 64 to 396)
  const paperX = 64 * scale;
  const paperY = 115 * scale;
  const paperW = (396 - 64) * scale;
  const paperH = (572 - 115) * scale;
  await sharp(upscaledMaster)
    .extract({ left: paperX, top: paperY, width: paperW, height: paperH })
    .webp({ quality: 95 })
    .toFile(path.join(assetsDir, 'scroll-paper.webp'));

  // 5. Create Rolled Scroll (Seamlessly touching top + bottom cylinders)
  const topRodBuf = await sharp(upscaledMaster)
    .extract({ left: 0, top: topY, width: upW, height: topH })
    .png()
    .toBuffer();

  const botRodBuf = await sharp(upscaledMaster)
    .extract({ left: 0, top: botY, width: upW, height: botH })
    .png()
    .toBuffer();

  // Overlap by 4px so cylinders touch naturally
  const rolledH = topH + botH - 4;
  const rolledCanvas = await sharp({
    create: {
      width: upW,
      height: rolledH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).png().toBuffer();

  await sharp(rolledCanvas)
    .composite([
      { input: botRodBuf, top: topH - 4, left: 0 },
      { input: topRodBuf, top: 0, left: 0 }
    ])
    .webp({ quality: 95 })
    .toFile(path.join(assetsDir, 'scroll-rolled.webp'));

  console.log(`Assets refined! Top: ${upW}x${topH}, Bot: ${upW}x${botH}, Paper: ${paperW}x${paperH}, Rolled: ${upW}x${rolledH}`);
}

refineAssets();
