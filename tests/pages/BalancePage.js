const BasePage = require('./BasePage');

class BalancePage extends BasePage {
  heading() { return this.text('balance-heading'); }
  async amount() { return BasePage.parseMoney(await this.text('balance-amount')); }
  back() { return this.click('balance-back'); }
}

module.exports = BalancePage;
