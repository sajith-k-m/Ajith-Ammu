import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const screenshotsDir = path.join(__dirname, '..', 'scratch_screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

(async () => {
  const chromePath = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
    ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4200/');

  console.log('Capturing real sequence frames...');

  // Frame 1: at 0.7s (rolled scroll in center)
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: path.join(screenshotsDir, 'step_1_rolled.png') });
  console.log('Saved step_1_rolled.png');

  // Frame 2: at 1.9s (~20% unrolled)
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(screenshotsDir, 'step_2_unroll_20pct.png') });
  console.log('Saved step_2_unroll_20pct.png');

  // Frame 3: at 2.4s (~55% unrolled)
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(screenshotsDir, 'step_3_unroll_55pct.png') });
  console.log('Saved step_3_unroll_55pct.png');

  // Frame 4: at 3.0s (~88% unrolled)
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(screenshotsDir, 'step_4_unroll_88pct.png') });
  console.log('Saved step_4_unroll_88pct.png');

  // Frame 5: at 4.2s (settled unrolled)
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(screenshotsDir, 'step_5_settled.png') });
  console.log('Saved step_5_settled.png');

  // Frame 6: at 5.5s (handwriting text revealing)
  await new Promise(r => setTimeout(r, 1300));
  await page.screenshot({ path: path.join(screenshotsDir, 'step_6_text.png') });
  console.log('Saved step_6_text.png');

  await browser.close();
  console.log('All step frames captured successfully!');
})();
