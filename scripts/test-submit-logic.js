const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testSubmitLogic() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  
  // Wait for intro unroll to finish and scroll to unlock
  await new Promise(r => setTimeout(r, 4000));

  // Scroll to RSVP Card
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise(r => setTimeout(r, 600));

  // Take screenshot of empty inline RSVP form
  await page.screenshot({ path: 'test-rsvp-form-before.png' });
  console.log('Saved test-rsvp-form-before.png');

  // Fill in RSVP form
  await page.type('input[name="rsvpName"]', 'Rahul & Sneha');
  
  // Select 3 Guests
  await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.guest-pill'));
    const pill3 = pills.find(p => p.textContent.includes('3'));
    if (pill3) pill3.click();
  });

  await page.type('input[name="rsvpNote"]', 'Excited for the Sadhya and celebrations!');
  await new Promise(r => setTimeout(r, 300));

  // Intercept window.open
  await page.evaluate(() => {
    window.open = (url) => console.log('WHATSAPP SUBMIT URL TRIGGERED:', url);
  });

  // Click Submit
  const submitBtn = await page.$('.primary-submit-rsvp-btn');
  if (submitBtn) {
    await submitBtn.click();
    console.log('Clicked submit RSVP button');
  }

  await new Promise(r => setTimeout(r, 600));

  // Take screenshot of submitted confirmation panel
  await page.screenshot({ path: 'test-rsvp-form-after.png' });
  console.log('Saved test-rsvp-form-after.png');

  // Reload page to test localStorage persistence
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 4000));
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'test-rsvp-form-persisted.png' });
  console.log('Saved test-rsvp-form-persisted.png');

  await browser.close();
  console.log('RSVP Submit Logic test complete!');
}

testSubmitLogic().catch(err => {
  console.error(err);
  process.exit(1);
});
