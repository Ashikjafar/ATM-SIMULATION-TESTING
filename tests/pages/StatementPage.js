const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class StatementPage extends BasePage {
  heading() { return this.text('statement-heading'); }

  /** Returns rows as [{ type, amount, balance }] newest first. */
  async rows() {
    await this.visible('statement-heading');
    const trs = await this.driver.findElements(By.css('#statement-body tr'));
    const out = [];
    for (const tr of trs) {
      const tds = await tr.findElements(By.css('td'));
      out.push({
        type: await tds[0].getText(),
        amount: parseFloat(await tds[1].getText()),
        balance: parseFloat(await tds[2].getText()),
      });
    }
    return out;
  }

  emptyMessageVisible() { return this.isDisplayed('statement-empty'); }
  back() { return this.click('statement-back'); }
}

module.exports = StatementPage;
