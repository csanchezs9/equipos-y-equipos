// Screenshots de QA con Playwright. Uso: node scripts/shot.mjs [ruta] [nombre]
import { chromium } from "playwright";
import fs from "node:fs";

const OUT = process.env.SHOT_DIR || "scrape/shots";
fs.mkdirSync(OUT, { recursive: true });

const path = process.argv[2] || "/";
const name = process.argv[3] || "home";
const BASE = process.env.BASE_URL || "http://localhost:3007";

const browser = await chromium.launch();

// Desktop
const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await d.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
await d.waitForTimeout(1800);
await d.screenshot({ path: `${OUT}/${name}-desktop-top.png` });
await d.screenshot({ path: `${OUT}/${name}-desktop-full.png`, fullPage: true });

// Mobile
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await m.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
await m.waitForTimeout(1500);
await m.screenshot({ path: `${OUT}/${name}-mobile-full.png`, fullPage: true });

await browser.close();
console.log(`OK shots -> ${OUT}/${name}-*`);
