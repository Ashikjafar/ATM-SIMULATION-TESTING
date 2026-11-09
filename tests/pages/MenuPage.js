const BasePage = require('./BasePage');

class MenuPage extends BasePage {
  heading() { return this.text('dashboard-heading'); }
  welcome() { return this.text('welcome-text'); }
  async balance() { return BasePage.parseMoney(await this.text('dashboard-balance')); }
  isVisible() { return this.isDisplayed('dashboard-page'); }

  openBalance() { return this.click('menu-balance'); }
  openWithdraw() { return this.click('menu-withdraw'); }
  openDeposit() { return this.click('menu-deposit'); }
  openTransfer() { return this.click('menu-transfer'); }
  openStatement() { return this.click('menu-statement'); }
  logout() { return this.click('menu-logout'); }
}

module.exports = MenuPage;
