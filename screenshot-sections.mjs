import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/HP/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/puppeteer/puppeteer.js');
import { mkdirSync } from 'fs';
import { join } from 'path';

const dir = './temporary screenshots';
mkdirSync(dir, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 1200));

const sections = [
  { id: '#about', name: 'about' },
  { id: '.metrics-section', name: 'metrics' },
  { id: '.marquee-section', name: 'marquee' },
  { id: '#services', name: 'services' },
  { id: 'footer', name: 'footer' },
];
for (const { id, name } of sections) {
  const el = await page.$(id);
  if (el) {
    // Scroll element to top of viewport
    await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, id);
    await new Promise(r => setTimeout(r, 600));
    // Take viewport screenshot (captures whatever is in viewport)
    await page.screenshot({
      path: join(dir, 'section-' + name + '.png'),
      fullPage: false
    });
    console.log('Saved section-' + name + '.png');
  } else {
    console.log('NOT FOUND: ' + id);
  }
}
await browser.close();
console.log('Done');
