const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testRopePhysics() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  
  // Wait for unroll to complete
  await new Promise(r => setTimeout(r, 3500));
  
  // Check initial rope state
  const initial = await page.evaluate(() => {
    const rope = document.querySelector('.golden-rope-container');
    const bell = document.querySelector('.tassel-bell-group');
    return {
      ropeTransform: rope ? getComputedStyle(rope).transform : null,
      ropeOpacity: rope ? getComputedStyle(rope).opacity : null,
      bellTransform: bell ? getComputedStyle(bell).transform : null
    };
  });
  console.log('Initial rope state after unroll:', initial);

  // Take screenshot of the unrolled letter with hanging physical rope/tassel
  await page.screenshot({ path: 'rope-unrolled-hanging.png' });
  console.log('Saved rope-unrolled-hanging.png');

  // Move mouse to induce stage tilt and pendulum reaction
  await page.mouse.move(200, 200);
  await new Promise(r => setTimeout(r, 400));
  
  const tilted = await page.evaluate(() => {
    const rope = document.querySelector('.golden-rope-container');
    const bell = document.querySelector('.tassel-bell-group');
    return {
      ropeTransform: rope ? getComputedStyle(rope).transform : null,
      bellTransform: bell ? getComputedStyle(bell).transform : null
    };
  });
  console.log('Rope state during mouse tilt:', tilted);

  // Scroll down to induce vertical inertia
  await page.evaluate(() => window.scrollTo(0, 300));
  await new Promise(r => setTimeout(r, 200));
  
  const scrolling = await page.evaluate(() => {
    const rope = document.querySelector('.golden-rope-container');
    const bell = document.querySelector('.tassel-bell-group');
    return {
      ropeTransform: rope ? getComputedStyle(rope).transform : null,
      bellTransform: bell ? getComputedStyle(bell).transform : null
    };
  });
  console.log('Rope state during scroll roll:', scrolling);
  await page.screenshot({ path: 'rope-scrolling-physics.png' });
  console.log('Saved rope-scrolling-physics.png');

  await browser.close();
}

testRopePhysics().catch(err => {
  console.error(err);
  process.exit(1);
});
