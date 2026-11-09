const { buildDriver, takeScreenshot, APP_URL } = require('./driver');
const LoginPage = require('../pages/LoginPage');
const MenuPage = require('../pages/MenuPage');

const ctx = { driver: null };

const VALID_CARD = '1234567890';
const VALID_PIN = '1234';
const DEST_ACCOUNT = '9876543210';
const START_BALANCE = 25000;

/** Mocha root hooks: one browser per run, fresh app state before each test. */
exports.mochaHooks = {
  async beforeAll() {
    this.timeout(60000);
    ctx.driver = await buildDriver();
  },
  async afterEach() {
    if (this.currentTest && this.currentTest.state === 'failed') {
      const file = await takeScreenshot(ctx.driver, this.currentTest.title);
      console.log(`    [screenshot] ${file}`);
    }
  },
  async afterAll() {
    if (ctx.driver) await ctx.driver.quit();
  },
};

/** Open a fresh (reset) ATM page. */
async function openFresh() {
  const login = new LoginPage(ctx.driver);
  await login.open(APP_URL);
  return login;
}

/** Open a fresh page and log in with valid credentials. */
async function loginAsValidUser() {
  const login = await openFresh();
  await login.login(VALID_CARD, VALID_PIN);
  const menu = new MenuPage(ctx.driver);
  await menu.heading();
  return menu;
}

module.exports.ctx = ctx;
module.exports.openFresh = openFresh;
module.exports.loginAsValidUser = loginAsValidUser;
module.exports.VALID_CARD = VALID_CARD;
module.exports.VALID_PIN = VALID_PIN;
module.exports.DEST_ACCOUNT = DEST_ACCOUNT;
module.exports.START_BALANCE = START_BALANCE;
