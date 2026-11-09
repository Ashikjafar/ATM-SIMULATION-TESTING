const { By, until } = require('selenium-webdriver');

const TIMEOUT = 5000;

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async find(id) {
    const el = await this.driver.wait(until.elementLocated(By.id(id)), TIMEOUT);
    return el;
  }

  async visible(id) {
    const el = await this.find(id);
    await this.driver.wait(until.elementIsVisible(el), TIMEOUT);
    return el;
  }

  async isDisplayed(id) {
    const els = await this.driver.findElements(By.id(id));
    return els.length > 0 && (await els[0].isDisplayed());
  }

  async click(id) {
    const el = await this.visible(id);
    await el.click();
  }

  async type(id, text) {
    const el = await this.visible(id);
    await el.clear();
    if (text !== '' && text !== undefined) await el.sendKeys(String(text));
  }

  async text(id) {
    const el = await this.visible(id);
    return (await el.getText()).trim();
  }

  /** Wait until an element's text is non-empty, then return it. */
  async messageText(id) {
    const el = await this.visible(id);
    await this.driver.wait(async () => (await el.getText()).trim().length > 0, TIMEOUT);
    return (await el.getText()).trim();
  }

  /** Parse "₹25,000.00" into 25000. */
  static parseMoney(str) {
    return parseFloat(str.replace(/[^0-9.]/g, ''));
  }
}

module.exports = BasePage;
