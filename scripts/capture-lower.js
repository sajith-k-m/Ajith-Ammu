const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureLower() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3800));

  // Ceremony and itinerary
  await page.evaluate(() => window.scrollTo(0, 2600));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test-7-ceremony-itinerary.png' });
  console.log('Saved test-7-ceremony-itinerary.png');

  // Story milestones, guestbook & footer
  await page.evaluate(() => window.scrollTo(0, 3600));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'test-8-guestbook-footer.png' });
  console.log('Saved test-8-guestbook-footer.png');

  // Test click on Photo Placeholder 1 to open Lightbox Modal
  await page.evaluate(() => window.scrollTo(0, 1600));
  await new Promise(r => setTimeout(r, 400));
  const photoCard = await page.$('.photo-card');
  if (photoCard) {
    await photoCard.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'test-9-photo-modal.png' });
    console.log('Saved test-9-photo-modal.png');
  }

  // Close modal and test RSVP personalization modal
  const closeBtn = await page.$('.modal-close-btn');
  if (closeBtn) {
    await closeBtn.click();
    await new Promise(r => setTimeout(r, 300));
  }

  await page.evaluate(() => window.scrollTo(0, 1100));
  await new Promise(r => setTimeout(r, 400));
  const rsvpModalBtn = await page.$('.secondary-modal-btn');
  if (rsvpModalBtn) {
    await rsvpModalBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'test-10-rsvp-modal.png' });
    console.log('Saved test-10-rsvp-modal.png');
  }

  await browser.close();
  console.log('Finished lower captures!');
}

captureLower().catch(err => {
  console.error(err);
  process.exit(1);
});
