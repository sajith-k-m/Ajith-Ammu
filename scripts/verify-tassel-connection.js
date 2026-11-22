const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testTasselConnection() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  await page.goto('http://localhost:4200', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Wait for unroll animation to complete
  await new Promise(r => setTimeout(r, 4500));
  
  // Get bounding box of the golden rope container
  const ropeBox = await page.evaluate(() => {
    const rope = document.querySelector('.golden-rope-container');
    if (!rope) return null;
    const rect = rope.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    };
  });
  console.log('Rope bounding box:', ropeBox);

  // Take full screenshot
  await page.screenshot({ path: 'tassel-full-screen.png' });
  
  // Take a close-up cropped screenshot of the bottom rod + hanging rope + tassel
  if (ropeBox && ropeBox.width > 0 && ropeBox.height > 0) {
    const clip = {
      x: Math.max(0, Math.floor(ropeBox.x - 100)),
      y: Math.max(0, Math.floor(ropeBox.y - 40)),
      width: Math.min(1200, Math.ceil(ropeBox.width + 200)),
      height: Math.min(Math.floor(900 - Math.max(0, ropeBox.y - 40)), Math.ceil(ropeBox.height + 80))
    };
    await page.screenshot({ path: 'tassel-closeup.png', clip });
    console.log('Saved tassel-closeup.png with clip:', clip);
  }

  await browser.close();
}

testTasselConnection().catch(err => {
  console.error(err);
  process.exit(1);
});
