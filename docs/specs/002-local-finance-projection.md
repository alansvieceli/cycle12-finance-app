# Spec 002 - Local 12-Month Finance Projection

## Objective

Create the first functional version of `cycle12-finance-app`: a local, offline 12-month personal finance projection based on the existing spreadsheet model in `planilha/Contas.ods`.

## Context

The current app is only the Expo bootstrap with a minimal home screen.

The user wants an app that replaces a personal finance spreadsheet used to project expenses, salary commitment, and monthly surplus/shortfall.

The spreadsheet has one year tab and organizes data by:

- months as columns
- expense groups as sections
- accounts/items inside each group
- due day per account/item
- editable monthly values
- monthly totals by group
- monthly total expenses
- salary commitment percentage
- surplus/shortfall by month

## Goals

- Store all finance data locally on the device.
- Support a projection view for up to 12 months.
- Allow manual editing of monthly values for each account/item.
- Allow credit card bills to be tracked as monthly total values.
- Calculate monthly totals and salary commitment.
- Keep the first feature simple and maintainable.

## Non-goals

- Do not add backend code.
- Do not add authentication.
- Do not add paid services.
- Do not implement backup and restore yet.
- Do not implement paid/unpaid status yet.
- Do not implement individual credit card purchases or installment splitting yet.
- Do not implement charts or advanced analytics yet.
- Do not import directly from the spreadsheet yet.

## Data Model

The app should support these concepts:

### Settings

- `monthlySalary`: fixed monthly salary used for all projection months.
- `currentMonthExtraBalance`: optional extra balance used only for the current month.

`monthlySalary` is equivalent to cell `B39` in the spreadsheet.

`currentMonthExtraBalance` represents extra money available now. It must affect only the current month, not future months.

### Category

Represents a finance group from the spreadsheet, such as:

- Cartão de Crédito
- Carro
- Empréstimo
- Casa Floripa
- Casa Porto Alegre
- Outros

Required fields:

- `id`
- `name`
- `sortOrder`

### Account Item

Represents a row inside a category, such as:

- Nubank
- Santander
- Volkswagen (Polo)
- Condomínio
- Luz
- TV/Internet
- Vivo

Required fields:

- `id`
- `categoryId`
- `name`
- `dueDay`
- `sortOrder`

The `*` column from the spreadsheet must be ignored.

### Monthly Value

Represents the manually editable value for one account item in one month.

Required fields:

- `accountItemId`
- `month`
- `year`
- `amount`

## Functional Requirements

### 12-Month Projection

The app must show a projection for up to 12 months.

The default view should start at the current month and continue through the next 11 months.

Each month should show:

- total expenses
- salary commitment percentage
- surplus or shortfall

### Category Totals

For each month, the app must calculate the total amount per category.

Category total equals the sum of all account item values in that category for that month.

### Monthly Total

For each month, the app must calculate total expenses.

Monthly total equals the sum of all category totals for that month.

### Salary Commitment

For each month, the app must calculate the salary commitment percentage.

Formula:

```text
salaryCommitmentPercentage = monthlyTotalExpenses / monthlySalary
```

If `monthlySalary` is zero or missing, the percentage should not be calculated.

### Surplus Or Shortfall

For the current month:

```text
availableIncome = monthlySalary + currentMonthExtraBalance
surplusOrShortfall = availableIncome - monthlyTotalExpenses
```

For future months:

```text
availableIncome = monthlySalary
surplusOrShortfall = monthlySalary - monthlyTotalExpenses
```

### Editable Monthly Values

The user must be able to edit the value of an account item for each month.

Credit cards are handled the same way as any other account item: the user edits the total bill value for each month.

### Local Persistence

All data must be saved locally on the device.

The implementation may add one simple local storage dependency if needed.

Recommended storage option:

- `@react-native-async-storage/async-storage`

Backup and restore are intentionally out of scope for this spec.

## UI Requirements

The app should provide a practical finance control interface, not a landing page.

Minimum expected views:

- monthly projection overview
- category/account item list
- settings for monthly salary and current month extra balance

The UI should prioritize scanning and editing finance data quickly.

The first implementation may use a simple mobile-friendly layout instead of trying to reproduce a spreadsheet grid exactly.

## Acceptance Criteria

- User can set a fixed monthly salary.
- User can set an extra balance for the current month.
- User can create, edit, and delete categories.
- User can create, edit, and delete account items.
- User can set a due day for each account item.
- User can edit monthly values for account items.
- App shows up to 12 months of projection.
- App calculates category totals per month.
- App calculates total expenses per month.
- App calculates salary commitment percentage per month.
- App calculates surplus/shortfall per month.
- Current month surplus/shortfall includes the extra balance.
- Future month surplus/shortfall does not include the extra balance.
- Data persists after closing and reopening the app.
- No backend, authentication, or paid service is added.

## Validation

When implemented, validate with available project commands:

```bash
npx tsc --noEmit
```

If lint or tests are available, run them as well.

If business calculation helpers are created, add unit tests for:

- category totals
- monthly total expenses
- salary commitment percentage
- surplus/shortfall
- current month extra balance behavior

## Documentation Requirements

Update README if implementation changes:

- setup commands
- dependencies
- app behavior
- local storage behavior

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
