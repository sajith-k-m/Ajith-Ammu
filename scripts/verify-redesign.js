const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Navigate to dev server
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  console.log('Loaded localhost:4200');

  // Wait for initial unroll animation to complete (approx 3.5s)
  await new Promise(r => setTimeout(r, 3800));
  await page.screenshot({ path: 'test-0-unrolled-letter.png' });
  console.log('Saved test-0-unrolled-letter.png');

  // Scroll to y = 380 (paper rolling up)
  await page.evaluate(() => window.scrollTo(0, 380));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test-1-paper-rolling.png' });
  console.log('Saved test-1-paper-rolling.png');

  // Scroll to y = 850 (transition complete: letter exited top, luxury chronometer & RSVP full screen)
  await page.evaluate(() => window.scrollTo(0, 850));
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: 'test-2-luxury-chronometer.png' });
  console.log('Saved test-2-luxury-chronometer.png');

  // Scroll to y = 1450 (Photo Placeholders Gallery & Ceremony)
  await page.evaluate(() => window.scrollTo(0, 1450));
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: 'test-3-photo-gallery.png' });
  console.log('Saved test-3-photo-gallery.png');

  // Scroll to y = 2200 (Itinerary, Story, Guestbook & Sign-off)
  await page.evaluate(() => window.scrollTo(0, 2200));
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: 'test-4-itinerary-guestbook.png' });
  console.log('Saved test-4-itinerary-guestbook.png');

  // Test Mobile Viewport (iPhone 14 / 390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.evaluate(() => window.scrollTo(0, 850));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test-5-mobile-chronometer.png' });
  console.log('Saved test-5-mobile-chronometer.png');

  await page.evaluate(() => window.scrollTo(0, 1500));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test-6-mobile-gallery.png' });
  console.log('Saved test-6-mobile-gallery.png');

  await browser.close();
  console.log('All tests completed successfully!');
}

verify().catch(err => {
  console.error('Error during verify:', err);
  process.exit(1);
});
