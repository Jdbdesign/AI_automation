import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/HP/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/puppeteer/puppeteer.js');
import { mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

const dir = './temporary screenshots';
mkdirSync(dir, { recursive: true });

const existing = readdirSync(dir).filter(f => f.endsWith('.png'));
const n = existing.length + 1;
const out = join(dir, `screenshot-${n}${label}.png`);

const browser = await puppeteer.launch({ headless: 'new' });
const page    = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});
await new Promise(r => setTimeout(r, 900));
// Full page
await page.screenshot({ path: out, fullPage: true });

// Viewport-only crop for hero inspection
const vpOut = out.replace('.png', '-viewport.png');
await page.screenshot({ path: vpOut, fullPage: false });
console.log(`Saved viewport: ${vpOut}`);
await browser.close();

console.log(`Saved: ${out}`);
