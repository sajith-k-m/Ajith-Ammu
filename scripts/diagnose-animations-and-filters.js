const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function diagnose() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:4200');
  await new Promise(r => setTimeout(r, 3500));

  const list = await page.evaluate(() => {
    const anims = [];
    const filters = [];
    const willChanges = [];

    document.querySelectorAll('*').forEach(el => {
      const cs = window.getComputedStyle(el);
      const tag = el.tagName.toLowerCase();
      const cls = el.className && typeof el.className === 'string' ? el.className.split(' ').slice(0, 3).join('.') : '';
      const id = `${tag}.${cls}`;

      if (cs.animationName && cs.animationName !== 'none') {
        anims.push({ id, name: cs.animationName, dur: cs.animationDuration });
      }
      if (cs.filter && cs.filter !== 'none') {
        filters.push({ id, filter: cs.filter });
      }
      if (cs.willChange && cs.willChange !== 'auto') {
        willChanges.push({ id, willChange: cs.willChange });
      }
    });

    return { anims, filters, willChanges };
  });

  console.log('--- ALL RUNNING ANIMATIONS (' + list.anims.length + ') ---');
  list.anims.forEach(a => console.log(`  ${a.id} -> ${a.name} (${a.dur})`));

  console.log('\n--- ALL FILTERS (' + list.filters.length + ') ---');
  list.filters.forEach(f => console.log(`  ${f.id} -> ${f.filter}`));

  console.log('\n--- ALL WILL-CHANGE (' + list.willChanges.length + ') ---');
  list.willChanges.forEach(w => console.log(`  ${w.id} -> ${w.willChange}`));

  await browser.close();
}

diagnose().catch(console.error);
