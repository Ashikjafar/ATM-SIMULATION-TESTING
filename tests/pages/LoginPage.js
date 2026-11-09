const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  async open(url) {
    await this.driver.get(url);
    await this.visible('login-heading');
  }

  async login(card, pin) {
    await this.type('card-number', card);
    await this.type('pin', pin);
    await this.click('login-btn');
  }

  heading() { return this.text('login-heading'); }
  message() { return this.messageText('login-message'); }
  isLoginVisible() { return this.isDisplayed('login-page'); }
}

module.exports = LoginPage;
