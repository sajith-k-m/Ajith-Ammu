const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function profilePerformance() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 915, isMobile: true, hasTouch: true });

  console.log('Navigating to http://localhost:4200 ...');
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });

  // Wait for intro to complete so scroll is unlocked
  await new Promise(r => setTimeout(r, 3500));

  console.log('Starting FPS & scroll profiling...');
  
  // Inject FPS tracker
  await page.evaluate(() => {
    window.fpsHistory = [];
    window.longFrames = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    function measureFrame(now) {
      const delta = now - lastTime;
      if (delta > 20) { // Frame took > 20ms (< 50 FPS)
        window.longFrames++;
      }
      frameCount++;
      lastTime = now;
      if (window.isMeasuring) {
        requestAnimationFrame(measureFrame);
      }
    }

    window.isMeasuring = true;
    requestAnimationFrame(measureFrame);
  });

  // Perform continuous touch-like scrolling from top to bottom
  const startTime = Date.now();
  for (let y = 0; y <= 2500; y += 40) {
    await page.evaluate(targetY => window.scrollTo(0, targetY), y);
    await new Promise(r => setTimeout(r, 16)); // ~60fps scroll step
  }
  const duration = (Date.now() - startTime) / 1000;

  const results = await page.evaluate(d => {
    window.isMeasuring = false;
    return {
      durationSec: d,
      longFrames: window.longFrames,
      scrollPosition: window.scrollY
    };
  }, duration);

  console.log('Profile results:', results);

  // Check running animations & composite layers
  const diagnostics = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    let runningAnimationsCount = 0;
    let elementsWithWillChange = 0;
    let elementsWithFilters = 0;
    let elementsWithBoxShadows = 0;

    allElements.forEach(el => {
      const cs = window.getComputedStyle(el);
      if (cs.animationName && cs.animationName !== 'none') {
        runningAnimationsCount++;
      }
      if (cs.willChange && cs.willChange !== 'auto') {
        elementsWithWillChange++;
      }
      if (cs.filter && cs.filter !== 'none') {
        elementsWithFilters++;
      }
      if (cs.boxShadow && cs.boxShadow !== 'none') {
        elementsWithBoxShadows++;
      }
    });

    return {
      totalElements: allElements.length,
      runningAnimationsCount,
      elementsWithWillChange,
      elementsWithFilters,
      elementsWithBoxShadows
    };
  });

  console.log('DOM & CSS Diagnostics:', diagnostics);

  await browser.close();
}

profilePerformance().catch(console.error);
