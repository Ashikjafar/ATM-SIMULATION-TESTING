const { expect } = require('chai');
const hooks = require('./helpers/hooks');
const TransferPage = require('./pages/TransferPage');
const WithdrawalPage = require('./pages/WithdrawalPage');
const DepositPage = require('./pages/DepositPage');
const StatementPage = require('./pages/StatementPage');

describe('Transactions - Fund Transfer', function () {
  this.timeout(30000);

  async function openTransfer() {
    const menu = await hooks.loginAsValidUser();
    await menu.openTransfer();
    return { menu, page: new TransferPage(hooks.ctx.driver) };
  }

  it('TC08 - valid transfer is confirmed and balance is updated', async () => {
    const { menu, page } = await openTransfer();
    await page.transfer(hooks.DEST_ACCOUNT, '3000');
    expect(await page.message()).to.include('Transfer successful');
    await page.back();
    expect(await menu.balance()).to.equal(22000);
  });

  it('invalid destination account format is rejected', async () => {
    const { page } = await openTransfer();
    await page.transfer('12AB', '1000');
    expect(await page.message()).to.equal('Invalid destination account.');
  });

  it('transfer to own account is rejected', async () => {
    const { page } = await openTransfer();
    await page.transfer(hooks.VALID_CARD, '1000');
    expect(await page.message()).to.equal('Invalid destination account.');
  });

  it('unknown destination account is rejected', async () => {
    const { page } = await openTransfer();
    await page.transfer('5555555555', '1000');
    expect(await page.message()).to.equal('Destination account not found.');
  });

  it('invalid transfer amount is rejected', async () => {
    const { page } = await openTransfer();
    await page.transfer(hooks.DEST_ACCOUNT, '150');
    expect(await page.message()).to.include('multiples of 100');
  });

  it('transfer above available balance shows insufficient balance', async () => {
    const { page } = await openTransfer();
    await page.transfer(hooks.DEST_ACCOUNT, '30000');
    expect(await page.message()).to.equal('Insufficient balance.');
  });

  it('empty transfer fields show a validation message', async () => {
    const { page } = await openTransfer();
    await page.transfer('', '');
    expect(await page.message()).to.equal('Destination account and amount are required.');
  });
});

describe('Mini Statement', function () {
  this.timeout(30000);

  it('shows an empty-state message when there are no transactions', async () => {
    const menu = await hooks.loginAsValidUser();
    await menu.openStatement();
    const s = new StatementPage(hooks.ctx.driver);
    expect(await s.rows()).to.have.lengthOf(0);
    expect(await s.emptyMessageVisible()).to.equal(true);
  });

  it('TC09 - lists recent transactions newest first (end-to-end flow)', async () => {
    const d = hooks.ctx.driver;
    const menu = await hooks.loginAsValidUser();

    await menu.openWithdraw();
    const w = new WithdrawalPage(d);
    await w.withdraw('2000');
    await w.message();
    await w.back();

    await menu.openDeposit();
    const dep = new DepositPage(d);
    await dep.deposit('5000');
    await dep.message();
    await dep.back();

    await menu.openTransfer();
    const t = new TransferPage(d);
    await t.transfer(hooks.DEST_ACCOUNT, '1000');
    await t.message();
    await t.back();

    expect(await menu.balance()).to.equal(27000);

    await menu.openStatement();
    const rows = await new StatementPage(d).rows();
    expect(rows.map((r) => r.type)).to.deep.equal(['Transfer', 'Deposit', 'Withdrawal']);
    expect(rows[0]).to.deep.include({ amount: 1000, balance: 27000 });
    expect(rows[2]).to.deep.include({ amount: 2000, balance: 23000 });
  });
});
