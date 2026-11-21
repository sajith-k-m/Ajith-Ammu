const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  
  // Test 1: Laptop standard (1366x768)
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  
  // Wait for unroll animation to complete (approx 3 seconds)
  await new Promise(r => setTimeout(r, 3500));
  
  await page.screenshot({ path: 'laptop-1366.png' });
  console.log('Saved laptop-1366.png');

  // Test 2: Full HD Desktop (1920x1080)
  await page.setViewport({ width: 1920, height: 1080 });
  await page.screenshot({ path: 'desktop-1920.png' });
  console.log('Saved desktop-1920.png');

  // Test 3: Mobile (390x844)
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: 'mobile-390.png' });
  console.log('Saved mobile-390.png');

  await browser.close();
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
