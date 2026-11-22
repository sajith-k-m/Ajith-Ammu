const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testMobile() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  
  // Click skip
  const skipBtn = await page.$('.skip-btn');
  if (skipBtn) await skipBtn.click();
  await new Promise(r => setTimeout(r, 400));

  // Scroll to chronometer
  await page.evaluate(() => window.scrollTo(0, 900));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test-mobile-1-chronometer.png' });
  console.log('Saved test-mobile-1-chronometer.png');

  // Scroll to actions & gallery
  await page.evaluate(() => window.scrollTo(0, 1500));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test-mobile-2-actions-gallery.png' });
  console.log('Saved test-mobile-2-actions-gallery.png');

  // Scroll to ceremony & itinerary
  await page.evaluate(() => window.scrollTo(0, 2700));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test-mobile-3-ceremony.png' });
  console.log('Saved test-mobile-3-ceremony.png');

  await browser.close();
}

testMobile().catch(err => {
  console.error(err);
  process.exit(1);
});
