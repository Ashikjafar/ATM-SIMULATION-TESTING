# ATM Simulation Testing

Software Testing Automation project for **B.Tech Artificial Intelligence and Data Science**, Excel Engineering College (Autonomous), Komarapalayam.
Submitted by **Ganeshraj B** (730923201031). Supervisor: R. Thilagavathi, M.E.

An automated functional test suite for a browser-based **Smart ATM** simulation, built with **Selenium WebDriver**, **Mocha**, **Chai** and the **Page Object Model**.

## Project structure

```
atm-simulation-testing/
├── app/                      # ATM simulation (application under test)
│   ├── index.html
│   ├── style.css
│   └── app.js
├── tests/
│   ├── helpers/
│   │   ├── driver.js         # Chrome driver + failure screenshots
│   │   └── hooks.js          # Mocha root hooks + shared setup
│   ├── pages/                # Page Object Model
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   ├── MenuPage.js
│   │   ├── BalancePage.js
│   │   ├── WithdrawalPage.js
│   │   ├── DepositPage.js
│   │   ├── TransferPage.js
│   │   └── StatementPage.js
│   ├── auth.spec.js
│   ├── navigation.spec.js
│   ├── withdrawal-deposit.spec.js
│   └── transfer-statement.spec.js
├── screenshots/              # Auto-captured on test failure
├── reports/                  # Mochawesome HTML/JSON report (generated)
├── .mocharc.json
└── package.json
```

## Prerequisites

- Node.js 18+
- Google Chrome (the `chromedriver` package downloads a matching driver on install)

## Run

```bash
npm install
npm test              # headless, generates reports/atm-test-report.html
npm run test:headed   # watch the browser
npm run test:auth     # authentication tests only
npm run test:txn      # withdrawal / deposit / transfer tests only
```

To try the app manually, open `app/index.html` in a browser.

**Demo data:** card `1234567890`, PIN `1234`, opening balance ₹25,000, valid transfer destination `9876543210`.

## ATM business rules under test

| Rule | Value |
|------|-------|
| Wrong PIN attempts before card is blocked | 3 |
| Withdrawal / deposit amounts | multiples of ₹100 |
| Max withdrawal per transaction | ₹20,000 |
| Max deposit per transaction | ₹50,000 |
| Mini statement | last 5 transactions, newest first |

## Test cases

| ID | Scenario | Expected result |
|----|----------|-----------------|
| TC01 | Valid ATM login | Main menu displayed |
| TC02 | Invalid PIN | Error message displayed |
| TC03 | Empty login fields | Validation displayed |
| TC04 | Balance enquiry | Correct balance displayed |
| TC05 | Valid withdrawal | Withdrawal successful, balance updated |
| TC06 | Insufficient balance | Warning displayed |
| TC07 | Cash deposit | Deposit confirmation shown |
| TC08 | Fund transfer | Transfer confirmation shown |
| TC09 | Mini statement | Recent transactions displayed |
| TC10 | Logout | Login page displayed |

The suite adds further negative and boundary cases: card blocking, withdrawal limit, non-multiple/zero/non-numeric/empty amounts, invalid/unknown/own destination accounts and an end-to-end withdraw, deposit and transfer flow.

## Reports and failure evidence

- `reports/atm-test-report.html` - Mochawesome HTML report with PASS/FAIL summary.
- `screenshots/` - a PNG is saved automatically for every failed test.

## Future enhancements

Cross-browser testing, data-driven tests, CI/CD integration, parallel execution, API testing, database validation, security testing and automated email reporting.
