const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testEntry() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:4200 ...');
  await page.goto('http://localhost:4200');

  // Immediately check state
  const state0 = await page.evaluate(() => {
    const scene = document.querySelector('app-intro-scene');
    const container = document.querySelector('.scene-container');
    const paper = document.querySelector('.paper-reveal-window');
    const skipBtn = document.querySelector('.skip-btn');
    const loader = document.querySelector('.loader-overlay');
    return {
      classes: container ? container.className : null,
      paperClip: paper ? paper.style.clipPath : null,
      hasSkip: !!skipBtn,
      hasLoader: !!loader
    };
  });
  console.log('State at t=0:', state0);
  await page.screenshot({ path: 'test-entry-00.png' });

  await new Promise(r => setTimeout(r, 600));
  const state600 = await page.evaluate(() => {
    const container = document.querySelector('.scene-container');
    const paper = document.querySelector('.paper-reveal-window');
    return {
      classes: container ? container.className : null,
      paperClip: paper ? paper.style.clipPath : null
    };
  });
  console.log('State at t=600ms:', state600);
  await page.screenshot({ path: 'test-entry-01.png' });

  await new Promise(r => setTimeout(r, 1200));
  const state1800 = await page.evaluate(() => {
    const container = document.querySelector('.scene-container');
    const paper = document.querySelector('.paper-reveal-window');
    return {
      classes: container ? container.className : null,
      paperClip: paper ? paper.style.clipPath : null
    };
  });
  console.log('State at t=1800ms:', state1800);
  await page.screenshot({ path: 'test-entry-02.png' });

  await new Promise(r => setTimeout(r, 1500));
  const state3300 = await page.evaluate(() => {
    const container = document.querySelector('.scene-container');
    const paper = document.querySelector('.paper-reveal-window');
    return {
      classes: container ? container.className : null,
      paperClip: paper ? paper.style.clipPath : null
    };
  });
  console.log('State at t=3300ms:', state3300);
  await page.screenshot({ path: 'test-entry-03.png' });

  await browser.close();
}

testEntry().catch(console.error);
