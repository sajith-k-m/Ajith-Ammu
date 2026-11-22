const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('Starting Kinetic Scrolling Physics Verification...');
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

    // 2. Continuous kinetic scroll to Chronometer & Velocity Ribbon
    console.log('Simulating kinetic scroll to Chronometer & Velocity Ribbon...');
    for (let y = 100; y <= 950; y += 70) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y);
      await sleep(40);
    }
    await sleep(1000);
    await page.screenshot({ path: 'verify-kinetic-01-chronometer-ribbon.png' });
    console.log('Saved verify-kinetic-01-chronometer-ribbon.png');

    // 3. Scroll to Velocity Ribbon and Action Suite (RSVP + Venue)
    console.log('Simulating kinetic scroll to Action Suite...');
    for (let y = 950; y <= 1500; y += 60) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y);
      await sleep(35);
    }
    await sleep(1000);
    await page.screenshot({ path: 'verify-kinetic-02-action-suite-wax.png' });
    console.log('Saved verify-kinetic-02-action-suite-wax.png');

    // 4. Scroll to Photo Gallery with staggered parallax
    console.log('Simulating kinetic scroll to Photo Gallery...');
    for (let y = 1500; y <= 2200; y += 60) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y);
      await sleep(35);
    }
    await sleep(1000);
    await page.screenshot({ path: 'verify-kinetic-03-photo-gallery.png' });
    console.log('Saved verify-kinetic-03-photo-gallery.png');

    // 5. Mobile viewport verification (iPhone 14 Pro: 393 x 852)
    console.log('Testing Mobile viewport (393 x 852)...');
    await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(4000);

    // Mobile scroll to Chronometer & Ribbon
    for (let y = 50; y <= 850; y += 50) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y);
      await sleep(30);
    }
    await sleep(1000);
    await page.screenshot({ path: 'verify-kinetic-04-mobile-chronometer-ribbon.png' });
    console.log('Saved verify-kinetic-04-mobile-chronometer-ribbon.png');

    // Mobile scroll to RSVP & Venue
    for (let y = 850; y <= 1650; y += 50) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y);
      await sleep(30);
    }
    await sleep(1000);
    await page.screenshot({ path: 'verify-kinetic-05-mobile-rsvp-venue.png' });
    console.log('Saved verify-kinetic-05-mobile-rsvp-venue.png');

    console.log('All Kinetic Physics Verifications Completed Successfully!');
  } finally {
    await browser.close();
  }
})();
