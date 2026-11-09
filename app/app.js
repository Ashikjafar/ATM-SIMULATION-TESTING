/* Smart ATM simulation - all state is in memory and resets on page reload. */
(function () {
  'use strict';

  var CARD = '1234567890';
  var PIN = '1234';
  var DEST_ACCOUNT = '9876543210';
  var WITHDRAW_LIMIT = 20000;
  var DEPOSIT_LIMIT = 50000;
  var MAX_PIN_ATTEMPTS = 3;

  var state = { balance: 25000, name: 'Ganeshraj B', attempts: 0, blocked: false, history: [] };

  var $ = function (id) { return document.getElementById(id); };
  var screens = ['login', 'dashboard', 'balance', 'withdraw', 'deposit', 'transfer', 'statement'];

  function money(n) {
    return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function show(name) {
    screens.forEach(function (s) { $(s + '-page').classList.toggle('hidden', s !== name); });
    if (name === 'dashboard') {
      $('welcome-text').textContent = 'Welcome, ' + state.name + '.';
      $('dashboard-balance').textContent = money(state.balance);
    }
    if (name === 'balance') $('balance-amount').textContent = money(state.balance);
    if (name === 'statement') renderStatement();
  }

  function setMsg(id, text, ok) {
    var el = $(id);
    el.textContent = text;
    el.className = 'message ' + (ok ? 'success' : 'error');
  }

  function parseAmount(raw) {
    var v = String(raw).trim();
    if (v === '') return { error: 'Please enter an amount.' };
    if (!/^\d+$/.test(v)) return { error: 'Invalid amount. Enter digits only.' };
    var n = parseInt(v, 10);
    if (n <= 0) return { error: 'Invalid amount. Amount must be greater than zero.' };
    if (n % 100 !== 0) return { error: 'Invalid amount. Enter multiples of 100.' };
    return { value: n };
  }

  function record(type, amount) {
    state.history.unshift({ type: type, amount: amount, balance: state.balance });
    state.history = state.history.slice(0, 5);
  }

  function renderStatement() {
    var body = $('statement-body');
    body.innerHTML = '';
    $('statement-empty').classList.toggle('hidden', state.history.length > 0);
    state.history.forEach(function (t) {
      var tr = document.createElement('tr');
      [t.type, t.amount.toFixed(2), t.balance.toFixed(2)].forEach(function (c) {
        var td = document.createElement('td');
        td.textContent = c;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }

  function login() {
    var card = $('card-number').value.trim();
    var pin = $('pin').value.trim();
    if (state.blocked) return setMsg('login-message', 'Card blocked. Too many incorrect PIN attempts.', false);
    if (card === '' || pin === '') return setMsg('login-message', 'Card number and PIN are required.', false);
    if (card !== CARD || pin !== PIN) {
      state.attempts += 1;
      if (state.attempts >= MAX_PIN_ATTEMPTS) {
        state.blocked = true;
        return setMsg('login-message', 'Card blocked. Too many incorrect PIN attempts.', false);
      }
      return setMsg('login-message', 'Incorrect card number or PIN. Attempts left: ' + (MAX_PIN_ATTEMPTS - state.attempts), false);
    }
    state.attempts = 0;
    $('login-message').textContent = '';
    $('login-message').className = 'message';
    show('dashboard');
  }

  function logout() {
    $('card-number').value = '';
    $('pin').value = '';
    $('login-message').textContent = '';
    show('login');
  }

  function withdraw() {
    var r = parseAmount($('withdraw-amount').value);
    if (r.error) return setMsg('withdraw-message', r.error, false);
    if (r.value > WITHDRAW_LIMIT) return setMsg('withdraw-message', 'Withdrawal limit exceeded. Maximum is ₹20,000 per transaction.', false);
    if (r.value > state.balance) return setMsg('withdraw-message', 'Insufficient balance.', false);
    state.balance -= r.value;
    record('Withdrawal', r.value);
    $('withdraw-amount').value = '';
    setMsg('withdraw-message', 'Withdrawal successful. Please collect your cash. New balance: ' + money(state.balance), true);
  }

  function deposit() {
    var r = parseAmount($('deposit-amount').value);
    if (r.error) return setMsg('deposit-message', r.error, false);
    if (r.value > DEPOSIT_LIMIT) return setMsg('deposit-message', 'Deposit limit exceeded. Maximum is ₹50,000 per transaction.', false);
    state.balance += r.value;
    record('Deposit', r.value);
    $('deposit-amount').value = '';
    setMsg('deposit-message', 'Deposit successful. New balance: ' + money(state.balance), true);
  }

  function transfer() {
    var acc = $('transfer-account').value.trim();
    var raw = $('transfer-amount').value;
    if (acc === '' || String(raw).trim() === '') return setMsg('transfer-message', 'Destination account and amount are required.', false);
    if (!/^\d{10}$/.test(acc) || acc === CARD) return setMsg('transfer-message', 'Invalid destination account.', false);
    if (acc !== DEST_ACCOUNT) return setMsg('transfer-message', 'Destination account not found.', false);
    var r = parseAmount(raw);
    if (r.error) return setMsg('transfer-message', r.error, false);
    if (r.value > state.balance) return setMsg('transfer-message', 'Insufficient balance.', false);
    state.balance -= r.value;
    record('Transfer', r.value);
    $('transfer-account').value = '';
    $('transfer-amount').value = '';
    setMsg('transfer-message', 'Transfer successful. New balance: ' + money(state.balance), true);
  }

  function clearForms() {
    ['withdraw-amount', 'deposit-amount', 'transfer-account', 'transfer-amount'].forEach(function (i) { $(i).value = ''; });
    ['withdraw-message', 'deposit-message', 'transfer-message'].forEach(function (i) { $(i).textContent = ''; $(i).className = 'message'; });
  }

  function nav(id, page) { $(id).addEventListener('click', function () { clearForms(); show(page); }); }

  $('login-btn').addEventListener('click', login);
  $('menu-logout').addEventListener('click', logout);
  $('withdraw-btn').addEventListener('click', withdraw);
  $('deposit-btn').addEventListener('click', deposit);
  $('transfer-btn').addEventListener('click', transfer);
  nav('menu-balance', 'balance');
  nav('menu-withdraw', 'withdraw');
  nav('menu-deposit', 'deposit');
  nav('menu-transfer', 'transfer');
  nav('menu-statement', 'statement');
  ['balance', 'withdraw', 'deposit', 'transfer', 'statement'].forEach(function (p) { nav(p + '-back', 'dashboard'); });

  show('login');
})();
