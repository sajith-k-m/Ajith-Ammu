const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('Starting Color Blend Metamorphosis Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating to http://localhost:4200 ...');
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle0', timeout: 30000 });

    // 1. Wait for letter intro sequence to complete
    await sleep(4000);
    await page.screenshot({ path: 'verify-blend-01-letter-dark.png' });
    console.log('Saved verify-blend-01-letter-dark.png (y=0, pure dark mahogany)');

    // 2. Scroll to 220px (right at threshold before transition)
    await page.evaluate(() => window.scrollTo({ top: 220, behavior: 'instant' }));
    await sleep(800);
    await page.screenshot({ path: 'verify-blend-02-pre-transition.png' });
    console.log('Saved verify-blend-02-pre-transition.png (y=220)');

    // 3. Scroll to 360px (golden wave crest emerges from bottom)
    await page.evaluate(() => window.scrollTo({ top: 360, behavior: 'instant' }));
    await sleep(800);
    await page.screenshot({ path: 'verify-blend-03-wave-emerges.png' });
    console.log('Saved verify-blend-03-wave-emerges.png (y=360)');

    // 4. Scroll to 520px (mid-transition: golden wave crest rising, radiant golden dawn bloom)
    await page.evaluate(() => window.scrollTo({ top: 520, behavior: 'instant' }));
    await sleep(800);
    await page.screenshot({ path: 'verify-blend-04-mid-dawn-bloom.png' });
    console.log('Saved verify-blend-04-mid-dawn-bloom.png (y=520)');

    // 5. Scroll to 680px (wave crest near top, peach silk sweeping over screen)
    await page.evaluate(() => window.scrollTo({ top: 680, behavior: 'instant' }));
    await sleep(800);
    await page.screenshot({ path: 'verify-blend-05-wave-high.png' });
    console.log('Saved verify-blend-05-wave-high.png (y=680)');

    // 6. Scroll to 920px (100% full royal peach silk palace with chronometer & velocity ribbon)
    await page.evaluate(() => window.scrollTo({ top: 920, behavior: 'instant' }));
    await sleep(800);
    await page.screenshot({ path: 'verify-blend-06-full-peach-chronometer.png' });
    console.log('Saved verify-blend-06-full-peach-chronometer.png (y=920)');

    // 7. Mobile Viewport (393 x 852)
    console.log('Verifying Mobile Viewport...');
    await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(4000);

    // Mobile mid-transition
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));
    await sleep(800);
    await page.screenshot({ path: 'verify-blend-07-mobile-mid-transition.png' });
    console.log('Saved verify-blend-07-mobile-mid-transition.png (y=500)');

    // Mobile full peach
    await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
    await sleep(800);
    await page.screenshot({ path: 'verify-blend-08-mobile-full-peach.png' });
    console.log('Saved verify-blend-08-mobile-full-peach.png (y=900)');

    console.log('All Color Blend Metamorphosis Verifications Complete!');
  } finally {
    await browser.close();
  }
})();
