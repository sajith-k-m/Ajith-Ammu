const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runFullVerification() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:4200 ...');
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });

  // 1. Wait for letter unroll sequence to complete
  await new Promise(r => setTimeout(r, 3800));

  // Capture unrolled letter with golden rope hanging from bottom rod
  await page.screenshot({ path: 'verify-01-letter-unrolled.png' });
  console.log('Saved verify-01-letter-unrolled.png');

  // 2. Test Rope Physics: Rapid cursor sweep across the tassel
  const ropePos = await page.evaluate(() => {
    const rope = document.querySelector('.golden-rope-container');
    if (!rope) return null;
    const rect = rope.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });
  console.log('Rope anchor position:', ropePos);

  if (ropePos) {
    // Fast swipe from left to right past the tassel
    await page.mouse.move(ropePos.x - 200, ropePos.y);
    await new Promise(r => setTimeout(r, 60));
    await page.mouse.move(ropePos.x - 50, ropePos.y, { steps: 3 });
    await new Promise(r => setTimeout(r, 40));
    await page.mouse.move(ropePos.x + 180, ropePos.y, { steps: 5 });

    // Check rope dynamic deflection
    const dynamicSwing = await page.evaluate(() => {
      const rope = document.querySelector('.golden-rope-container');
      const bell = document.querySelector('.tassel-bell-group');
      return {
        ropeTransform: rope ? getComputedStyle(rope).transform : null,
        bellTransform: bell ? getComputedStyle(bell).transform : null
      };
    });
    console.log('Rope dynamic swing on cursor swipe:', dynamicSwing);
    await page.screenshot({ path: 'verify-02-rope-cursor-swing.png' });
    console.log('Saved verify-02-rope-cursor-swing.png');
  }

  // 3. Test Scroll Roll & Vertical Rope Physics
  await page.evaluate(() => window.scrollTo(0, 320));
  await new Promise(r => setTimeout(r, 200));
  const scrollRope = await page.evaluate(() => {
    const rope = document.querySelector('.golden-rope-container');
    return rope ? getComputedStyle(rope).transform : null;
  });
  console.log('Rope transform during scroll roll:', scrollRope);
  await page.screenshot({ path: 'verify-03-scroll-roll-rope.png' });
  console.log('Saved verify-03-scroll-roll-rope.png');

  // 4. Scroll down into Details Section
  await page.evaluate(() => window.scrollTo(0, 1150));
  await new Promise(r => setTimeout(r, 600));

  // Hover over Royal Chronometer to trigger ReactBits Spotlight & 3D Tilt
  await page.mouse.move(550, 400);
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'verify-04-chronometer-spotlight.png' });
  console.log('Saved verify-04-chronometer-spotlight.png');

  // 5. Scroll to RSVP Suite & Test Interactive Form
  await page.evaluate(() => window.scrollTo(0, 1450));
  await new Promise(r => setTimeout(r, 600));

  // Hover over RSVP card
  await page.mouse.move(450, 350);
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'verify-05-rsvp-form-empty.png' });
  console.log('Saved verify-05-rsvp-form-empty.png');

  // Fill in RSVP form
  await page.type('input[name="rsvpName"]', 'Rahul & Sneha');

  // Select 3 Guests
  await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.guest-pill'));
    const pill3 = pills.find(p => p.textContent.includes('3'));
    if (pill3) pill3.click();
  });

  await page.type('input[name="rsvpNote"]', 'Hearty congratulations to Ammu & Ajith! Delighted to celebrate.');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'verify-06-rsvp-form-filled.png' });
  console.log('Saved verify-06-rsvp-form-filled.png');

  // Intercept WhatsApp window.open
  let waUrlTriggered = null;
  await page.evaluate(() => {
    window.open = (url) => {
      window._capturedWaUrl = url;
    };
  });

  // Hover on Submit button (test magnetic hover)
  const submitBtn = await page.$('.primary-submit-rsvp-btn');
  if (submitBtn) {
    const box = await submitBtn.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2 + 10, box.y + box.height / 2 + 5);
      await new Promise(r => setTimeout(r, 200));
    }
    await submitBtn.click();
    console.log('Clicked Submit RSVP button');
  }

  await new Promise(r => setTimeout(r, 600));

  waUrlTriggered = await page.evaluate(() => window._capturedWaUrl);
  console.log('Captured WhatsApp URL:', waUrlTriggered);

  // Take screenshot of Submitted Confirmed State
  await page.screenshot({ path: 'verify-07-rsvp-confirmed.png' });
  console.log('Saved verify-07-rsvp-confirmed.png');

  // 6. Scroll down to Photo Gallery, Sacred Muhurtham, and Itinerary
  await page.evaluate(() => window.scrollTo(0, 2400));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'verify-08-photo-gallery.png' });
  console.log('Saved verify-08-photo-gallery.png');

  await page.evaluate(() => window.scrollTo(0, 3300));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'verify-09-ceremony-itinerary.png' });
  console.log('Saved verify-09-ceremony-itinerary.png');

  // 7. Mobile Viewport Verification
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3800));
  await page.screenshot({ path: 'verify-10-mobile-unrolled.png' });
  console.log('Saved verify-10-mobile-unrolled.png');

  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'verify-11-mobile-details.png' });
  console.log('Saved verify-11-mobile-details.png');

  await browser.close();
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
}

runFullVerification().catch(err => {
  console.error(err);
  process.exit(1);
});
