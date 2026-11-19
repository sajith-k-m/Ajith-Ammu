const sharp = require('sharp');

(async () => {
  const { data, info } = await sharp('src/assets/images/rod.webp').raw().toBuffer({ resolveWithObject: true });
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
  console.log('Rod image height:', h);
  console.log('Shaft vertical span at center:', minY, 'to', maxY, 'thickness:', maxY - minY + 1);
  console.log('Top empty space above shaft in rod.webp:', minY, 'pixels out of', h, `(${(minY/h*100).toFixed(1)}%)`);
  console.log('Bottom empty space below shaft in rod.webp:', (h - 1 - maxY), 'pixels out of', h, `${(((h - 1 - maxY)/h)*100).toFixed(1)}%`);
})();
