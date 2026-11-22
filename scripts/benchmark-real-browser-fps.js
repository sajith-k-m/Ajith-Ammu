const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function benchmarkRealFPS() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4200');
  await page.waitForSelector('.scroll-unlocked', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 500));

  const result = await page.evaluate(() => {
    return new Promise(resolve => {
      const records = [];
      let lastTime = performance.now();
      let currentY = 0;
      const maxY = 2500;
      const speed = 25;

      function step(now) {
        const dt = now - lastTime;
        lastTime = now;
        records.push({ y: currentY, dt });

        currentY += speed;
        window.scrollTo(0, currentY);

        if (currentY < maxY) {
          requestAnimationFrame(step);
        } else {
          const totalFrames = records.length;
          const goodFrames = records.filter(r => r.dt <= 20).length;
          const avgDt = records.reduce((sum, r) => sum + r.dt, 0) / totalFrames;
          const avgFPS = Math.round(1000 / avgDt);
          const worst = records.sort((a, b) => b.dt - a.dt).slice(0, 5);
          resolve({
            totalFrames,
            goodFrames,
            goodFramePercent: Math.round((goodFrames / totalFrames) * 100) + '%',
            avgFPS,
            worst5: worst
          });
        }
      }

      requestAnimationFrame(step);
    });
  });

  console.log('Benchmark Result:', JSON.stringify(result, null, 2));
  await browser.close();
}

benchmarkRealFPS().catch(console.error);
