const BasePage = require('./BasePage');

class DepositPage extends BasePage {
  heading() { return this.text('deposit-heading'); }

  async deposit(amount) {
    await this.type('deposit-amount', amount);
    await this.click('deposit-btn');
  }

  message() { return this.messageText('deposit-message'); }
  back() { return this.click('deposit-back'); }
}

module.exports = DepositPage;
