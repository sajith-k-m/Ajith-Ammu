const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function traceScroll() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4200');
  await new Promise(r => setTimeout(r, 3500));

  await page.evaluate(() => {
    window.frameTimings = [];
    let last = performance.now();
    function tick(now) {
      const dt = now - last;
      window.frameTimings.push({ y: window.scrollY, dt: Math.round(dt * 10) / 10 });
      last = now;
      if (window.keepTracing) requestAnimationFrame(tick);
    }
    window.keepTracing = true;
    requestAnimationFrame(tick);
  });

  for (let y = 0; y <= 2500; y += 40) {
    await page.evaluate(targetY => window.scrollTo(0, targetY), y);
    await new Promise(r => setTimeout(r, 16));
  }

  const timings = await page.evaluate(() => {
    window.keepTracing = false;
    return window.frameTimings.filter(f => f.dt > 22);
  });

  console.log('Long frames count (>22ms):', timings.length);
  timings.forEach(t => console.log(`  at scrollY = ${t.y}px, frame took ${t.dt}ms`));

  await browser.close();
}

traceScroll().catch(console.error);
