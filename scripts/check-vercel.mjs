import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const screenshotsDir = path.join(__dirname, '..', 'scratch_screenshots');

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
  
  console.log('Navigating to https://ajith-ammu.vercel.app/ ...');
  await page.goto('https://ajith-ammu.vercel.app/', { waitUntil: 'networkidle0' });

  // Wait 2.6s for active unroll
  await new Promise(r => setTimeout(r, 2600));
  await page.screenshot({ path: path.join(screenshotsDir, 'vercel_unroll.png') });
  console.log('Saved vercel_unroll.png');

  // Wait for text reveal
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(screenshotsDir, 'vercel_final.png') });
  console.log('Saved vercel_final.png');

  await browser.close();
  console.log('Vercel live verification complete!');
})();
