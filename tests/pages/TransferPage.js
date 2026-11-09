const BasePage = require('./BasePage');

class TransferPage extends BasePage {
  heading() { return this.text('transfer-heading'); }

  async transfer(account, amount) {
    await this.type('transfer-account', account);
    await this.type('transfer-amount', amount);
    await this.click('transfer-btn');
  }

  message() { return this.messageText('transfer-message'); }
  back() { return this.click('transfer-back'); }
}

module.exports = TransferPage;
