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

  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4200/');

  // Click skip to immediately get to final completed state
  await page.waitForSelector('.skip-btn');
  await page.click('.skip-btn');
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(screenshotsDir, 'new_text_mobile.png') });
  console.log('Saved new_text_mobile.png');

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(screenshotsDir, 'new_text_desktop.png') });
  console.log('Saved new_text_desktop.png');

  await browser.close();
})();
