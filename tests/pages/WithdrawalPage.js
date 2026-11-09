const BasePage = require('./BasePage');

class WithdrawalPage extends BasePage {
  heading() { return this.text('withdraw-heading'); }

  async withdraw(amount) {
    await this.type('withdraw-amount', amount);
    await this.click('withdraw-btn');
  }

  message() { return this.messageText('withdraw-message'); }
  back() { return this.click('withdraw-back'); }
}

module.exports = WithdrawalPage;
