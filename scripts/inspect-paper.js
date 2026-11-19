const sharp = require('sharp');

(async () => {
  const { data, info } = await sharp('src/assets/images/paper.webp').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const cx = Math.floor(w / 2);
  let minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    const idx = (y * w + cx) * 4;
    const alpha = data[idx + 3];
    if (alpha > 20) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  console.log('Paper image height:', h);
  console.log('Paper vertical span at center:', minY, 'to', maxY);
  console.log('Top space in paper.webp:', minY);
  console.log('Bottom space in paper.webp:', (h - 1 - maxY));
})();
