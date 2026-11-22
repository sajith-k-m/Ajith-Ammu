const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function debugModal() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  
  // Click skip to instantly complete intro
  const skipBtn = await page.$('.skip-btn');
  if (skipBtn) {
    await skipBtn.click();
    console.log('Clicked skip button');
  }
  await new Promise(r => setTimeout(r, 500));

  // Scroll to 1000px so transition is 100% complete
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise(r => setTimeout(r, 500));

  // Check photo cards
  const cardsCount = await page.evaluate(() => document.querySelectorAll('.photo-card').length);
  console.log('Photo cards found:', cardsCount);

  // Click the first photo card directly via JS
  await page.evaluate(() => {
    const card = document.querySelector('.photo-card');
    if (card) {
      console.log('Clicking card in browser...');
      card.click();
    }
  });

  await new Promise(r => setTimeout(r, 500));

  // Check if modal-backdrop exists in DOM
  const modalInfo = await page.evaluate(() => {
    const mb = document.querySelector('.modal-backdrop');
    if (!mb) return 'No .modal-backdrop found!';
    const rect = mb.getBoundingClientRect();
    const dialog = mb.querySelector('.modal-dialog');
    const dRect = dialog ? dialog.getBoundingClientRect() : null;
    return {
      backdrop: { top: rect.top, left: rect.left, width: rect.width, height: rect.height, zIndex: getComputedStyle(mb).zIndex, position: getComputedStyle(mb).position },
      dialog: dRect ? { top: dRect.top, left: dRect.left, width: dRect.width, height: dRect.height } : 'no dialog'
    };
  });
  console.log('Modal check result:', JSON.stringify(modalInfo, null, 2));

  await page.screenshot({ path: 'test-debug-modal.png' });
  console.log('Saved test-debug-modal.png');

  await browser.close();
}

debugModal().catch(err => {
  console.error(err);
  process.exit(1);
});
