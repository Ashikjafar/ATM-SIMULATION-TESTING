const { expect } = require('chai');
const hooks = require('./helpers/hooks');
const MenuPage = require('./pages/MenuPage');

describe('Authentication', function () {
  this.timeout(30000);

  it('TC01 - valid card and PIN opens the main menu', async () => {
    const login = await hooks.openFresh();
    await login.login(hooks.VALID_CARD, hooks.VALID_PIN);
    const menu = new MenuPage(hooks.ctx.driver);
    expect(await menu.heading()).to.equal('SMART ATM - CUSTOMER DASHBOARD');
    expect(await menu.welcome()).to.include('Ganeshraj B');
    expect(await menu.balance()).to.equal(hooks.START_BALANCE);
  });

  it('TC02 - incorrect PIN shows an error message', async () => {
    const login = await hooks.openFresh();
    await login.login(hooks.VALID_CARD, '0000');
    expect(await login.message()).to.include('Incorrect card number or PIN');
    expect(await login.isLoginVisible()).to.equal(true);
  });

  it('TC03 - empty login fields show a validation message', async () => {
    const login = await hooks.openFresh();
    await login.login('', '');
    expect(await login.message()).to.equal('Card number and PIN are required.');
  });

  it('TC03b - empty PIN only shows a validation message', async () => {
    const login = await hooks.openFresh();
    await login.login(hooks.VALID_CARD, '');
    expect(await login.message()).to.equal('Card number and PIN are required.');
  });

  it('unknown card number is rejected', async () => {
    const login = await hooks.openFresh();
    await login.login('1111111111', hooks.VALID_PIN);
    expect(await login.message()).to.include('Incorrect card number or PIN');
  });

  it('card is blocked after three incorrect PIN attempts', async () => {
    const login = await hooks.openFresh();
    await login.login(hooks.VALID_CARD, '1111');
    await login.login(hooks.VALID_CARD, '2222');
    await login.login(hooks.VALID_CARD, '3333');
    expect(await login.message()).to.include('Card blocked');
    // even the correct PIN must now fail
    await login.login(hooks.VALID_CARD, hooks.VALID_PIN);
    expect(await login.message()).to.include('Card blocked');
    expect(await login.isLoginVisible()).to.equal(true);
  });
});
