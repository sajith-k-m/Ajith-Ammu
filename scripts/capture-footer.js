const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureFooter() {
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

  // Scroll to bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'test-bottom-footer.png' });
  console.log('Saved test-bottom-footer.png');

  await browser.close();
}

captureFooter().catch(err => {
  console.error(err);
  process.exit(1);
});
