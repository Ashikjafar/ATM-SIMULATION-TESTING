const { expect } = require('chai');
const hooks = require('./helpers/hooks');
const BalancePage = require('./pages/BalancePage');
const WithdrawalPage = require('./pages/WithdrawalPage');
const DepositPage = require('./pages/DepositPage');
const TransferPage = require('./pages/TransferPage');
const StatementPage = require('./pages/StatementPage');
const LoginPage = require('./pages/LoginPage');

describe('Balance and Navigation', function () {
  this.timeout(30000);

  it('TC04 - balance enquiry shows the correct balance', async () => {
    const menu = await hooks.loginAsValidUser();
    await menu.openBalance();
    const balance = new BalancePage(hooks.ctx.driver);
    expect(await balance.heading()).to.equal('Balance Enquiry');
    expect(await balance.amount()).to.equal(hooks.START_BALANCE);
  });

  it('menu navigates to every transaction screen and back', async () => {
    const d = hooks.ctx.driver;
    const menu = await hooks.loginAsValidUser();

    await menu.openWithdraw();
    const w = new WithdrawalPage(d);
    expect(await w.heading()).to.equal('Cash Withdrawal');
    await w.back();

    await menu.openDeposit();
    const dep = new DepositPage(d);
    expect(await dep.heading()).to.equal('Cash Deposit');
    await dep.back();

    await menu.openTransfer();
    const t = new TransferPage(d);
    expect(await t.heading()).to.equal('Fund Transfer');
    await t.back();

    await menu.openStatement();
    const s = new StatementPage(d);
    expect(await s.heading()).to.equal('Mini Statement');
    await s.back();

    expect(await menu.isVisible()).to.equal(true);
  });

  it('TC10 - logout returns to the login page', async () => {
    const menu = await hooks.loginAsValidUser();
    await menu.logout();
    const login = new LoginPage(hooks.ctx.driver);
    expect(await login.heading()).to.equal('Insert Card & Enter PIN');
    expect(await login.isLoginVisible()).to.equal(true);
    expect(await menu.isVisible()).to.equal(false);
  });
});
