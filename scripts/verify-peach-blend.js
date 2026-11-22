const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('Launching browser to verify Peach luxury blend...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:4200 ...');
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0', timeout: 30000 });

  // 1. Wait for unroll animation
  await sleep(4000);
  await page.screenshot({ path: 'verify-peach-01-letter-dark.png' });
  console.log('Saved verify-peach-01-letter-dark.png');

  // 2. Scroll to 450px (mid-blend)
  await page.evaluate(() => {
    window.scrollTo({ top: 450, behavior: 'instant' });
  });
  await sleep(1500);
  await page.screenshot({ path: 'verify-peach-02-mid-blend.png' });
  console.log('Saved verify-peach-02-mid-blend.png');

  // 3. Scroll to 1000px (full peach luxury chronometer & heading)
  await page.evaluate(() => {
    window.scrollTo({ top: 950, behavior: 'instant' });
  });
  await sleep(1500);
  await page.screenshot({ path: 'verify-peach-03-chronometer.png' });
  console.log('Saved verify-peach-03-chronometer.png');

  // 4. Scroll to RSVP & Venue section
  await page.evaluate(() => {
    window.scrollTo({ top: 1550, behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: 'verify-peach-04-rsvp-venue.png' });
  console.log('Saved verify-peach-04-rsvp-venue.png');

  // 5. Scroll to Photo Gallery & Ceremony
  await page.evaluate(() => {
    window.scrollTo({ top: 2200, behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: 'verify-peach-05-gallery.png' });
  console.log('Saved verify-peach-05-gallery.png');

  // 6. Scroll to Story & Guestbook
  await page.evaluate(() => {
    window.scrollTo({ top: 3100, behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: 'verify-peach-06-story-guestbook.png' });
  console.log('Saved verify-peach-06-story-guestbook.png');

  // 7. Scroll to Footer
  await page.evaluate(() => {
    window.scrollTo({ top: 4000, behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: 'verify-peach-07-footer.png' });
  console.log('Saved verify-peach-07-footer.png');

  await browser.close();
  console.log('PEACH BLEND VERIFICATION COMPLETE!');
})();
