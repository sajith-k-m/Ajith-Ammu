const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureExactRsvp() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 4000));

  // Get offset of rsvp card
  const pos = await page.evaluate(() => {
    const el = document.querySelector('.rsvp-suite-card');
    return el ? el.getBoundingClientRect().top + window.scrollY : null;
  });
  console.log('RSVP Card offsetTop:', pos);

  await page.evaluate((y) => window.scrollTo(0, y - 40), pos);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test-exact-rsvp-form.png' });
  console.log('Saved test-exact-rsvp-form.png');

  // Fill in and submit
  await page.type('input[name="rsvpName"]', 'Rahul & Sneha');
  await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.guest-pill'));
    const pill = pills.find(p => p.textContent.includes('2'));
    if (pill) pill.click();
  });
  await page.type('input[name="rsvpNote"]', 'Hearty congratulations to Ammu & Ajith!');
  await new Promise(r => setTimeout(r, 200));

  // Intercept window.open
  await page.evaluate(() => { window.open = () => {}; });

  const btn = await page.$('.primary-submit-rsvp-btn');
  if (btn) await btn.click();
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'test-exact-rsvp-confirmed.png' });
  console.log('Saved test-exact-rsvp-confirmed.png');

  await browser.close();
}

captureExactRsvp().catch(err => {
  console.error(err);
  process.exit(1);
});
