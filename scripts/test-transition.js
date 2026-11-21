const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testTransition() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1366,768']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  
  // Wait for initial unroll animation to complete
  await new Promise(r => setTimeout(r, 3500));
  await page.screenshot({ path: 'frame-0-unrolled.png' });
  console.log('Saved frame-0-unrolled.png');

  // Test y = 250 (midway Phase 1: ~50% rolled)
  await page.evaluate(() => window.scrollTo(0, 250));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'frame-1-halfroll.png' });
  console.log('Saved frame-1-halfroll.png');

  // Test y = 380 (3/4 rolled up)
  await page.evaluate(() => window.scrollTo(0, 380));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'frame-2-threequarter.png' });
  console.log('Saved frame-2-threequarter.png');

  // Test y = 600 (balance rolling + letter moving up + details rising from below)
  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'frame-3-transition.png' });
  console.log('Saved frame-3-transition.png');

  // Test y = 850 (100% rolled, letter off screen, details full screen)
  await page.evaluate(() => window.scrollTo(0, 850));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'frame-4-fullscreen.png' });
  console.log('Saved frame-4-fullscreen.png');

  // Test y = 1100 (exploring full screen details)
  await page.evaluate(() => window.scrollTo(0, 1100));
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'frame-5-details-explore.png' });
  console.log('Saved frame-5-details-explore.png');

  await browser.close();
}

testTransition().catch(err => {
  console.error(err);
  process.exit(1);
});
