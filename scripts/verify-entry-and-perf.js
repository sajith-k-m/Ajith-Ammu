const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runVerification() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('--- 1. Testing Desktop Entry Animation (1440x900) ---');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 900 });

  // Navigate without waiting for idle so we catch the entry unroll sequence in flight
  desktopPage.goto('http://localhost:4200');

  // t=150ms: Closed or settling state
  await new Promise(r => setTimeout(r, 150));
  await desktopPage.screenshot({ path: 'verify-entry-01-initial.png' });
  console.log('Saved verify-entry-01-initial.png');

  // t=900ms: Actively unrolling
  await new Promise(r => setTimeout(r, 750));
  const unrollingState = await desktopPage.evaluate(() => {
    const c = document.querySelector('.scene-container');
    const paper = document.querySelector('.paper-reveal-window');
    return {
      classes: c ? c.className : null,
      clipPath: paper ? paper.style.clipPath : null
    };
  });
  console.log('Unrolling state at ~900ms:', unrollingState);
  await desktopPage.screenshot({ path: 'verify-entry-02-unrolling.png' });
  console.log('Saved verify-entry-02-unrolling.png');

  // t=3200ms: Unroll complete, text revealed, rope hanging
  await new Promise(r => setTimeout(r, 2300));
  const completeState = await desktopPage.evaluate(() => {
    const c = document.querySelector('.scene-container');
    const rope = document.querySelector('.golden-rope-container');
    const textBlock = document.querySelector('.names-title');
    return {
      classes: c ? c.className : null,
      hasRope: !!rope,
      namesText: textBlock ? textBlock.textContent.trim().replace(/\s+/g, ' ') : null
    };
  });
  console.log('Complete state at 3200ms:', completeState);
  await desktopPage.screenshot({ path: 'verify-entry-03-complete.png' });
  console.log('Saved verify-entry-03-complete.png');

  console.log('\n--- 2. Testing Desktop Scroll Transition & Details Section ---');
  // Scroll down into liquid wave transition
  await desktopPage.evaluate(() => window.scrollTo(0, 520));
  await new Promise(r => setTimeout(r, 400));
  await desktopPage.screenshot({ path: 'verify-entry-04-wave-transition.png' });
  console.log('Saved verify-entry-04-wave-transition.png');

  // Scroll down to Chronometer & RSVP
  await desktopPage.evaluate(() => window.scrollTo(0, 1400));
  await new Promise(r => setTimeout(r, 500));
  await desktopPage.screenshot({ path: 'verify-entry-05-chronometer-rsvp.png' });
  console.log('Saved verify-entry-05-chronometer-rsvp.png');

  await desktopPage.close();

  console.log('\n--- 3. Testing Mobile Viewport Entry Animation (393x852) ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({
    width: 393,
    height: 852,
    isMobile: true,
    hasTouch: true
  });

  mobilePage.goto('http://localhost:4200');

  // Check initial
  await new Promise(r => setTimeout(r, 200));
  await mobilePage.screenshot({ path: 'verify-mobile-entry-01-closed.png' });
  console.log('Saved verify-mobile-entry-01-closed.png');

  // Check unrolling
  await new Promise(r => setTimeout(r, 800));
  await mobilePage.screenshot({ path: 'verify-mobile-entry-02-unrolling.png' });
  console.log('Saved verify-mobile-entry-02-unrolling.png');

  // Check complete
  await new Promise(r => setTimeout(r, 2200));
  const mobileCompleteState = await mobilePage.evaluate(() => {
    const c = document.querySelector('.scene-container');
    const rope = document.querySelector('.golden-rope-container');
    const floating = document.querySelectorAll('.floating-node');
    return {
      classes: c ? c.className : null,
      hasRope: !!rope,
      floatingNodesCount: floating.length
    };
  });
  console.log('Mobile Complete State:', mobileCompleteState);
  await mobilePage.screenshot({ path: 'verify-mobile-entry-03-complete.png' });
  console.log('Saved verify-mobile-entry-03-complete.png');

  // Mobile scroll to details
  await mobilePage.evaluate(() => window.scrollTo(0, 950));
  await new Promise(r => setTimeout(r, 400));
  await mobilePage.screenshot({ path: 'verify-mobile-entry-04-chronometer.png' });
  console.log('Saved verify-mobile-entry-04-chronometer.png');

  await mobilePage.evaluate(() => window.scrollTo(0, 1600));
  await new Promise(r => setTimeout(r, 400));
  await mobilePage.screenshot({ path: 'verify-mobile-entry-05-rsvp-venue.png' });
  console.log('Saved verify-mobile-entry-05-rsvp-venue.png');

  await mobilePage.close();
  await browser.close();
  console.log('\nVerification complete!');
}

runVerification().catch(console.error);
