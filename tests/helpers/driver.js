const path = require('path');
const fs = require('fs');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const APP_URL = process.env.ATM_URL ||
  'file://' + path.resolve(__dirname, '..', '..', 'app', 'index.html');

const SCREENSHOT_DIR = path.resolve(__dirname, '..', '..', 'screenshots');

async function buildDriver() {
  const options = new chrome.Options();
  if (process.env.HEADLESS !== 'false') options.addArguments('--headless=new');
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,900');
  return new Builder().forBrowser('chrome').setChromeOptions(options).build();
}

async function takeScreenshot(driver, name) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const safe = name.replace(/[^a-z0-9]+/gi, '_').slice(0, 80);
  const file = path.join(SCREENSHOT_DIR, `${safe}_${Date.now()}.png`);
  fs.writeFileSync(file, await driver.takeScreenshot(), 'base64');
  return file;
}

module.exports = { APP_URL, buildDriver, takeScreenshot };
