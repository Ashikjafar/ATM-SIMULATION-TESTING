const { expect } = require('chai');
const hooks = require('./helpers/hooks');
const WithdrawalPage = require('./pages/WithdrawalPage');
const DepositPage = require('./pages/DepositPage');

describe('Transactions - Withdrawal', function () {
  this.timeout(30000);

  async function openWithdraw() {
    const menu = await hooks.loginAsValidUser();
    await menu.openWithdraw();
    return { menu, page: new WithdrawalPage(hooks.ctx.driver) };
  }

  it('TC05 - valid withdrawal is processed and balance is updated', async () => {
    const { menu, page } = await openWithdraw();
    await page.withdraw('5000');
    expect(await page.message()).to.include('Withdrawal successful');
    await page.back();
    expect(await menu.balance()).to.equal(20000);
  });

  it('TC06 - insufficient balance shows a warning', async () => {
    const { page } = await openWithdraw();
    await page.withdraw('20000'); // balance becomes 5,000
    expect(await page.message()).to.include('Withdrawal successful');
    await page.withdraw('10000');
    expect(await page.message()).to.equal('Insufficient balance.');
  });

  it('amount above the per-transaction limit is rejected', async () => {
    const { menu, page } = await openWithdraw();
    await page.withdraw('25000');
    expect(await page.message()).to.include('Withdrawal limit exceeded');
    await page.back();
    expect(await menu.balance()).to.equal(hooks.START_BALANCE);
  });

  it('amount that is not a multiple of 100 is rejected', async () => {
    const { page } = await openWithdraw();
    await page.withdraw('550');
    expect(await page.message()).to.include('multiples of 100');
  });

  it('non-numeric amount is rejected', async () => {
    const { page } = await openWithdraw();
    await page.withdraw('abc');
    expect(await page.message()).to.include('Invalid amount');
  });

  it('zero amount is rejected', async () => {
    const { page } = await openWithdraw();
    await page.withdraw('0');
    expect(await page.message()).to.include('greater than zero');
  });

  it('empty amount shows a validation message', async () => {
    const { page } = await openWithdraw();
    await page.withdraw('');
    expect(await page.message()).to.equal('Please enter an amount.');
  });
});

describe('Transactions - Deposit', function () {
  this.timeout(30000);

  async function openDeposit() {
    const menu = await hooks.loginAsValidUser();
    await menu.openDeposit();
    return { menu, page: new DepositPage(hooks.ctx.driver) };
  }

  it('TC07 - valid deposit is confirmed and balance is updated', async () => {
    const { menu, page } = await openDeposit();
    await page.deposit('10000');
    expect(await page.message()).to.include('Deposit successful');
    await page.back();
    expect(await menu.balance()).to.equal(35000);
  });

  it('invalid deposit amount is rejected', async () => {
    const { menu, page } = await openDeposit();
    await page.deposit('-500');
    expect(await page.message()).to.include('Invalid amount');
    await page.back();
    expect(await menu.balance()).to.equal(hooks.START_BALANCE);
  });

  it('deposit above the limit is rejected', async () => {
    const { page } = await openDeposit();
    await page.deposit('60000');
    expect(await page.message()).to.include('Deposit limit exceeded');
  });
});
