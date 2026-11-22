const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testRsvpModal() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  
  const skipBtn = await page.$('.skip-btn');
  if (skipBtn) await skipBtn.click();
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => window.scrollTo(0, 1100));
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const btn = document.querySelector('.secondary-modal-btn');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'test-rsvp-modal-open.png' });
  console.log('Saved test-rsvp-modal-open.png');

  await browser.close();
}

testRsvpModal().catch(err => {
  console.error(err);
  process.exit(1);
});
