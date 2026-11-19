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

  // Wait until unrolling starts (step === 'unrolling')
  await page.waitForFunction(() => {
    return document.querySelector('.rod-top')?.classList.contains('unrolling');
  });

  // Just 250ms into unroll (about 10% open)
  await new Promise(r => setTimeout(r, 250));

  await page.evaluate(() => {
    const els = document.querySelectorAll('*');
    for (const el of els) {
      el.style.animationPlayState = 'paused';
    }
  });

  await page.screenshot({ path: path.join(screenshotsDir, 'early_roll_10pct.png') });
  console.log('Saved early_roll_10pct.png');

  await browser.close();
})();
