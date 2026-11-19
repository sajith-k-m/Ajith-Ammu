import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  : 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:4200/');

  for (let t = 0; t <= 5000; t += 250) {
    const data = await page.evaluate(() => {
      const el = document.querySelector('.rod-top');
      if (!el) return null;
      const style = window.getComputedStyle(el);
      const paper = document.querySelector('.paper-reveal-window');
      return {
        class: el.className,
        transform: style.transform,
        opacity: style.opacity,
        clip: paper ? window.getComputedStyle(paper).clipPath : 'none'
      };
    });
    console.log(`t=${t}ms: class='${data?.class}' opacity=${data?.opacity} transform=${data?.transform} clip=${data?.clip}`);
    await new Promise(r => setTimeout(r, 250));
  }
  await browser.close();
})();
