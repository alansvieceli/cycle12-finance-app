# Graph Report - . (2026-07-11)

## Corpus Check

- 378 files · ~179,007 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 1371 nodes · 2757 edges · 112 communities (78 shown, 34 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 216 edges (avg confidence: 0.81)
- Token cost: 1,869,456 input · 0 output

## Community Hubs (Navigation)

- Finance Calculations & Category/Account Editors
- Finance State, Backup & Local Storage
- Early Architecture Specs & Standards (001-005)
- Commitment Goal & Spending Trends UI
- App Context Documentation
- Rolling Window, Installments & App Lock (018-020)
- Expo Package Dependencies
- Month History & Extra Balance
- Figma Refresh, App Context & Hide Values (021,024,025)
- Notification Icon & Balance Reconciliation (037-038)
- Payment Checklist & Charts Tab (006-008)
- Due Date Reminders & App Lock Lib
- Currency Input & Adjustment Panel Components
- Currency Mask & Add Account From Payments
- Expo App Config (app.json)
- Salary Distribution, Spending Trends & Goal Specs
- Bar Chart Components & Gifted Chart Adapters
- App Shell & Tab Bar
- Monthly Value Editor & Inline Adjust Panel
- Summary Panels & Formatters
- Chart Panel & Salary Distribution UI
- Icon/Splash & Reminders Specs (023,034,037)
- Hide Values & Currency Mask Plan Concepts
- Typography & Icon/Splash Tasks (022-023)
- Root Docs (AGENTS/CLAUDE/README) & Reminders Tasks
- Commitment Color & Dark Theme (009-010)
- Lint/Test Tooling Dependencies
- App Lock Hook, Lib & Storage
- Month History & Goal Plan Concepts
- Spending Trends & Commitment Goal Spec Concepts
- NPM Scripts
- Architecture Refactor & App Lock Plan Concepts
- Code Quality Tooling (016)
- Summary Visibility & Sorting Plan Concepts
- Add Account & God Hook Refactor Specs
- TypeScript & Jest Config Refs
- Core Feature Plan Concepts (persistence, tabs, backup)
- Due Date Reminders Plan Concepts
- App Context Documentation & Balance Spec Concepts
- Gifted Charts Concepts
- Tabbed Workflow & Rolling Window Concepts
- Commitment Calculation Plan Concepts
- Splash & Notifications Config
- Backup/Restore Concepts (014)
- Commitment Goal Plan Concepts (036)
- financeCalculations.ts Concepts
- Monthly Value Adjustment (015)
- Currency Mask Spec Concepts (032)
- Month History & Salary Distribution Spec Concepts
- Duplication Policy & ModalShell Component
- Settings Screen & Currency Input
- Eye Icon & Hide Values Spec Concepts
- Charts Tab & Gifted Charts Plan Concepts
- Monthly Adjustment & Installment Plan Concepts
- Add Account Plan Concepts
- Action Button & App Lock Overlay
- App Entry & Notifications Lib
- Bootstrap & Local Projection Plan Concepts (001-002)
- Splash & Icon Plan Concepts
- Payment Checklist Spec Concepts (cross-spec)
- Month History Spec Concepts
- Extra Balance Spec Concepts
- Coverage Config & Formatter Tests (005)
- ESLint Config Concepts
- Dark Theme & Typography Plan Concepts
- Adjust Account Value From Payments (029)
- Safe Area Insets (028)
- Bootstrap Expo Project Tasks (001)
- Settings Tab Label (012)
- Code Quality Tooling Plan Concepts
- Adjust Value & Spec 015 Concepts
- Extract Components/App Shell Tasks (004)
- Package Metadata
- Lint-Staged Config
- Android Centered Splash Plugin
- Husky .husky/h Script
- Charts Screen Mockups (graficos-o1/o2/o2.1)
- EyeIcon Component
- eslint-config-expo Dependency
- eslint-config-prettier Dependency
- eslint-plugin-prettier Dependency
- Husky Dependency
- Husky applypatch-msg Hook
- Husky commit-msg Hook
- Husky husky.sh Script
- Husky post-applypatch Hook
- Husky post-checkout Hook
- Husky post-commit Hook
- Husky post-merge Hook
- Husky post-rewrite Hook
- Husky pre-applypatch Hook
- Husky pre-auto-gc Hook
- Husky pre-commit Hook
- Husky pre-merge-commit Hook
- Husky pre-push Hook
- Husky pre-rebase Hook
- Husky prepare-commit-msg Hook
- jest-expo Dependency
- Prettier Dependency
- react-test-renderer Dependency
- Settings Screen Mockups (configuracoes-o1/o2)
- Planning Screen Mockups (planejamento-o1/o2)
- Summary Screen Mockups (resumo-o1/o2)
- Adaptive Icon Foreground Asset
- App Icon Asset
- Favicon Asset
- Header Logo Asset
- Splash Logo Asset
- Categories Screen Mockup
- Charts Screen Mockup (Option 3)

## God Nodes (most connected - your core abstractions)

1. `colors` - 38 edges
2. `typography` - 30 edges
3. `SummaryScreen()` - 29 edges
4. `maskCurrency()` - 25 edges
5. `App Context - Cycle12 Finance` - 25 edges
6. `sortCategories()` - 20 edges
7. `Spec 002: Local 12-Month Finance Projection` - 19 edges
8. `Spec 003: Tabbed Finance Workflow` - 19 edges
9. `CurrentMonthPaymentChecklist()` - 18 edges
10. `FinanceState` - 18 edges

## Surprising Connections (you probably didn't know these)

- `resolveCommitmentColor()` --shares_data_with--> `commitmentDangerThreshold field` [INFERRED]
  src/lib/commitmentColor.ts → docs/tasks/009-02-update-data-model.md
- `resolveCommitmentColor()` --shares_data_with--> `commitmentWarningThreshold field` [INFERRED]
  src/lib/commitmentColor.ts → docs/tasks/009-02-update-data-model.md
- `ReminderSettings` --conceptually_related_to--> `appLock.ts (mirrored pattern)` [INFERRED]
  src/lib/reminders.ts → docs/tasks/034-02-add-reminder-settings-storage.md
- `Eye Closed Icon (Hide Values Toggle)` --conceptually_related_to--> `Spec 025 - Hide Values Toggle` [INFERRED]
  assets/eye-closed.svg → docs/specs/025-hide-values-toggle.md
- `Design: Adicionar Conta pela Tela Pagamentos do Mes` --references--> `FinanceApp()` [EXTRACTED]
  docs/superpowers/specs/2026-06-06-payments-add-account-design.md → src/FinanceApp.tsx

## Import Cycles

- None detected.

## Hyperedges (group relationships)

- **Cycle12 Finance fixed five-area bottom navigation** — docs_app_context_resumo, docs_app_context_graficos, docs_app_context_planejar, docs_app_context_contas, docs_app_context_ajustes [EXTRACTED 1.00]
- **Quality gate documentation set enforced before closing a spec** — docs_standards_testing_policy, docs_standards_spec_completion_policy, docs_quality_coverage_baseline, docs_standards_code_duplication_policy [INFERRED 0.85]
- **Shared building blocks created by the 2026-06-10 duplication refactor** — src_components_common_modalshell_modalshell, src_components_finance_adjustmentpanel_adjustmentpanel, src_components_finance_chartpanel_chartpanel, src_components_finance_summaryvalue_summaryvalue, src_theme_sharedstyles_sharedstyles, src_lib_financestatefixtures_financestatefixtures [EXTRACTED 1.00]
- **Design Token Consolidation (Color, Typography, Figma System)** — docs_plans_010_dark_finance_theme_plan_shared_color_tokens, docs_plans_022_typography_standardization_plan_typography_tokens, docs_plans_021_figma_layout_refresh_plan_figma_design_system [INFERRED 0.80]
- **Ajustes/Configurações Settings Surface Evolution** — docs_plans_003_tabbed_finance_workflow_plan_four_tab_workflow, docs_plans_012_settings_tab_label_plan_configuracoes_label_rename, docs_plans_021_figma_layout_refresh_plan_ajustes_composition, docs_plans_020_app_lock_plan_biometric_app_lock [INFERRED 0.75]
- **Monthly Adjustment and Installment Entry Flow** — docs_plans_015_monthly_value_adjustments_plan_monthly_value_adjustment_helper, docs_plans_019_installment_value_entry_plan_installmentmonths_helper, docs_plans_019_installment_value_entry_plan_monthlyvalueeditor [INFERRED 0.85]
- **Value Masking System (valuesHidden + maskCurrency + masked inputs)** — docs_plans_025_hide_values_toggle_plan_valueshidden, docs_plans_025_hide_values_toggle_plan_maskcurrency, editableamountinput_tsx_editableamountinput [INFERRED 0.85]
- **Month History Insight Pipeline** — docs_plans_030_month_history_plan_monthhistoryentry, src_lib_spendingtrends_ts_computetotaltrend, docs_plans_030_month_history_plan_historycard [EXTRACTED 1.00]
- **Commitment Goal Status Display** — docs_plans_036_commitment_goal_plan_goaltag, docs_plans_036_commitment_goal_plan_resolvegoalstatus, docs_plans_036_commitment_goal_plan_monthlycommitmentlist [EXTRACTED 1.00]
- **Gráficos Tab Evolution: Simple Charts to Gifted Charts to Figma Restyle** — docs_specs_008_finance_charts_tab_spec, docs_specs_011_gifted_charts_visual_upgrade_spec, docs_specs_021_figma_layout_refresh_spec [INFERRED 0.85]
- **Settings Tab Introduction, Rename, and Figma Renaming** — docs_specs_003_tabbed_finance_workflow_spec, docs_specs_012_settings_tab_label_spec, docs_specs_021_figma_layout_refresh_spec [INFERRED 0.75]
- **Monthly Value Entry, Adjustment, and Installment Flow** — docs_specs_002_local_finance_projection_spec, docs_specs_015_monthly_value_adjustments_spec, docs_specs_019_installment_value_entry_spec [INFERRED 0.85]
- **Pagamentos Screen Modal Enhancements (add + adjust)** — docs_specs_025_hide_values_toggle_currentmonthpaymentchecklist, docs_specs_026_add_account_from_payments_currentmonthpaymentchecklist, docs_specs_029_adjust_account_value_from_payments_currentmonthpaymentchecklist [INFERRED 0.85]
- **Resumo Current-Month Insight Panels** — docs_specs_033_salary_distribution_panel_salary_distribution_panel, docs_specs_035_spending_trends_and_averages_spending_trends_and_averages, docs_specs_036_commitment_goal_commitment_goal [INFERRED 0.75]
- **Monetary Input Privacy and Masking Overhaul** — docs_specs_025_hide_values_toggle_hide_values_toggle, docs_specs_031_quick_add_extra_balance_quick_add_extra_balance, docs_specs_032_currency_input_mask_currency_input_mask [INFERRED 0.75]
- **Spec 002 Local Finance Projection Task Group** — docs_specs_002_local_finance_projection_spec, docs_tasks_002_01_add_local_storage_foundation_local_storage_foundation, docs_tasks_002_02_add_finance_calculations_finance_calculations, docs_tasks_002_03_build_projection_overview_projection_overview [INFERRED 0.75]
- **Spec 003 Tabbed Workflow Task Group** — docs_specs_003_tabbed_finance_workflow_spec, docs_tasks_003_02_add_tab_shell_tab_shell, docs_tasks_003_03_refine_summary_tab_summary_tab, docs_tasks_003_04_refine_planning_tab_planning_tab [INFERRED 0.75]
- **Spec 004 Architecture Refactor Task Group** — docs_specs_004_react_native_architecture_refactor_spec, docs_tasks_004_01_extract_formatting_and_input_utils_formatting_and_input_utils, docs_tasks_004_02_extract_finance_state_hook_finance_state_hook, docs_tasks_004_03_extract_common_components_common_components [INFERRED 0.80]
- **Tasks Implementing Spec 006 (Summary Visibility and Payment Status)** — docs_specs_006_summary_visibility_and_payment_status, docs_tasks_006_02_expose_visible_month_setting_task, docs_tasks_006_03_add_payment_status_model_task, docs_tasks_006_04_add_current_month_payment_checklist_task [INFERRED 0.85]
- **Tasks Implementing Spec 007 (Sorting and Compact Management Panels)** — docs_specs_007_sorting_and_compact_management_panels, docs_tasks_007_02_add_sorting_helpers_task, docs_tasks_007_03_refine_planning_management_panel_task, docs_tasks_007_04_refine_summary_details_panel_task [INFERRED 0.85]
- **Tasks Implementing Spec 008 (Finance Charts Tab)** — docs_specs_008_finance_charts_tab, docs_tasks_008_02_add_chart_data_helpers_task, docs_tasks_008_03_add_chart_components_task, docs_tasks_008_04_add_charts_screen_and_tab_task [INFERRED 0.85]
- **Commitment color threshold feature (data model, helper, settings UI)** — src_types_finance_financesettings, src_lib_commitmentcolor_resolvecommitmentcolor, src_screens_settingsscreen_settingsscreen [INFERRED 0.85]
- **Backup, restore, and reset feature group** — concept_c12f_backup_format, src_hooks_usefinancestate_replacefinancestate, concept_gerenciar_dados_panel [INFERRED 0.85]
- **Gifted charts visual upgrade feature group** — dep_react_native_gifted_charts, concept_gifted_chart_adapters, concept_gifted_balance_chart [INFERRED 0.85]
- **Rolling Window And Category Propagation Feature (018)** — docs_tasks_018_01_update_finance_model_and_migration_task, docs_tasks_018_02_add_window_advance_helper_task, docs_tasks_018_03_wire_window_advance_state_task, docs_tasks_018_04_update_category_and_settings_ui_task [INFERRED 0.85]
- **Installment Adjustment Feature (019)** — docs_tasks_019_01_add_installment_months_helper_task, docs_tasks_019_02_wire_installment_adjustments_task, docs_tasks_019_03_update_adjustment_ui_task [INFERRED 0.85]
- **App Lock Feature (020)** — docs_tasks_020_02_add_app_lock_storage_and_helpers_task, docs_tasks_020_03_add_app_lock_hook_task, docs_tasks_020_04_add_app_lock_overlay_task, docs_tasks_020_05_add_security_settings_ui_task [INFERRED 0.85]
- **App icon and splash alignment pipeline (confirm direction, generate assets, align native resources)** — docs_tasks_023_01_confirm_icon_direction_task, docs_tasks_023_02_generate_standard_icon_assets_task, docs_tasks_023_04_align_android_native_resources_task [INFERRED 0.85]
- **Hide-values toggle foundational building blocks (icon, formatter, state)** — docs_tasks_025_01_add_eye_icon_component_task, docs_tasks_025_02_add_mask_currency_helper_task, docs_tasks_025_03_wire_values_hidden_state_task [INFERRED 0.85]
- **App context documentation effort (agent doc, human README, enforcement standard)** — docs_tasks_024_01_add_app_context_docs_task, docs_tasks_024_02_update_human_readme_context_task, docs_tasks_024_03_add_app_context_standard_task [INFERRED 0.85]
- **Spec 026 account-creation-from-Pagamentos implementation chain** — src_hooks_usefinancestate_createaccountitemandsetvalue, src_components_finance_currentmonthpaymentchecklist, src_financeapp [INFERRED 0.85]
- **Spec 030 month-history data-to-UI pipeline** — src_types_finance_monthhistoryentry, src_lib_windowadvance_buildhistoryentry, src_components_finance_historycard [INFERRED 0.85]
- **Spec 032 currency-mask helper-to-field migration chain** — src_lib_currencymask, src_components_editableamountinput, src_components_finance_monthlyvalueeditor [INFERRED 0.85]
- **Tasks implementing Spec 033 (Salary Distribution Panel)** — docs_tasks_033_02_add_salary_distribution_panel_task, docs_tasks_033_03_wire_panel_into_summary_task, docs_tasks_033_04_update_docs_and_validate_task [EXTRACTED 1.00]
- **MonthlyCommitmentList + ChartsScreen + commitmentGoal setting form the chart meta-line feature** — src_components_finance_monthlycommitmentlist_monthlycommitmentlist, src_screens_chartsscreen_chartsscreen, src_types_finance_financesettings_commitmentgoal [INFERRED 0.75]
- **buildDueReminders + syncReminders + useReminders form the reminder scheduling pipeline** — src_lib_reminders_buildduereminders, src_lib_syncreminders_syncreminders, src_hooks_usereminders_usereminders [INFERRED 0.85]
- **Spec 038 Account Balance Reconciliation Task Sequence** — docs_tasks_038_01_add_account_balance_helper_task, docs_tasks_038_02_wire_resumo_kpi_and_shortcut_task, docs_tasks_038_03_update_docs_and_validate_task [INFERRED 0.90]
- **Spec 037 Android Notification Icon Task Sequence** — docs_tasks_037_02_configure_notification_icon_task, docs_tasks_037_03_update_docs_and_validate_task, docs_specs_037_android_notification_icon [INFERRED 0.85]
- **Saldo em Conta KPI Feature (helper + card + component)** — docs_tasks_038_01_add_account_balance_helper_calculateaccountbalance, docs_tasks_038_02_wire_resumo_kpi_and_shortcut_saldo_em_conta_kpi, docs_tasks_038_02_wire_resumo_kpi_and_shortcut_kpicard_component [INFERRED 0.85]

## Communities (112 total, 34 thin omitted)

### Community 0 - "Finance Calculations & Category/Account Editors"

Cohesion: 0.05
Nodes (71): Task 036-05: Add Meta Line and Legend to Commitment Chart, AccountEditor(), AccountEditorProps, ALL_DAYS, getCategoryName(), styles, CategoryEditor(), CategoryEditorProps (+63 more)

### Community 1 - "Finance State, Backup & Local Storage"

Cohesion: 0.06
Nodes (65): DataManagementPanel(), DataManagementPanelProps, styles, adjustMonthlyValueAmount(), baseState, projectionMonth, useFinanceState(), calculateSha256() (+57 more)

### Community 2 - "Early Architecture Specs & Standards (001-005)"

Cohesion: 0.09
Nodes (66): Plan 002 - Local Finance Projection, Plan 003 - Tabbed Finance Workflow, Plan 004 - React Native Architecture Refactor, Spec 001: Bootstrap Expo Project, Category Data Model, FinanceSettings Data Model, MonthlyValue Data Model, Spec 002: Local 12-Month Finance Projection (+58 more)

### Community 3 - "Commitment Goal & Spending Trends UI"

Cohesion: 0.11
Nodes (33): Task 036-02: Add Goal Status Helper, Task 036-04: Wire Goal Marker and Tag into Resumo, Projeção, Histórico, Rationale: reuse semaphore color constants without calling resolveCommitmentColor, GoalTag(), GoalTagProps, styles, DetailTab, formatVariationText() (+25 more)

### Community 4 - "App Context Documentation"

Cohesion: 0.09
Nodes (38): AGENTS.md (Project Agent Rules), CLAUDE.md (Claude Instructions), App Context - Cycle12 Finance, Account Item (Data Concept), Ajustes Tab, Biometric App Lock, .c12f Backup File, Category (Data Concept) (+30 more)

### Community 5 - "Rolling Window, Installments & App Lock (018-020)"

Cohesion: 0.09
Nodes (38): Plan 018: Rolling Window And Category Propagation, Plan 019: Installment Value Entry, Plan 020: App Lock, Spec 018: Rolling Window And Category Propagation, Spec 019: Installment Value Entry, Spec 020: App Lock, Category propagation field (default 'zero'), Task 018-01: Update Finance Model And Migration (+30 more)

### Community 6 - "Expo Package Dependencies"

Cohesion: 0.05
Nodes (39): expo, expo-asset, expo-blur, expo-crypto, expo-document-picker, expo-file-system, expo-linear-gradient, expo-local-authentication (+31 more)

### Community 7 - "Month History & Extra Balance"

Cohesion: 0.11
Nodes (31): app-context.md Extra balance section, app-context.md Month history section, Plan 030: Month History, Plan 031: Quick Add Extra Balance, Spec 030: Month History, Spec 031: Quick Add Extra Balance, Task 030-01: Update Data Model, Task 030-02: Add History Capture to Window Advance (+23 more)

### Community 8 - "Figma Refresh, App Context & Hide Values (021,024,025)"

Cohesion: 0.11
Nodes (31): Plan 021: Figma Layout Refresh, Plan 024: App Context Documentation Plan, Plan 025: Hide Values Toggle Plan, Spec 021: Figma Layout Refresh, Spec 024: App Context Documentation, Spec 025: Hide Values Toggle, Task 021-01: Add Figma Layout Refresh Docs, Fixed bottom navigation (Resumo, Gráficos, Planejar, Contas, Ajustes) (+23 more)

### Community 9 - "Notification Icon & Balance Reconciliation (037-038)"

Cohesion: 0.11
Nodes (28): Android drawable-\* notification_icon.png resources, assets/app-icon.png (source branding), assets/notification-icon.png, Plan 037: Android Notification Icon Plan, Plan 038: Account Balance Reconciliation, Spec 037: Android Notification Icon, Spec 038: Account Balance Reconciliation, Task 037-01: Add Notification Icon Assets (+20 more)

### Community 10 - "Payment Checklist & Charts Tab (006-008)"

Cohesion: 0.09
Nodes (28): Plan 008: Finance Charts Tab Plan, Spec 008: Finance Charts Tab, Task 006-01 - Add Plan And Tasks, Task 006-02 - Expose Visible Month Setting, visibleMonthCount Setting, MonthlyPaymentStatus Model, Task 006-03 - Add Payment Status Model, Current-Month Payment Checklist (Resumo) (+20 more)

### Community 11 - "Due Date Reminders & App Lock Lib"

Cohesion: 0.13
Nodes (22): Task 034-02: Add Reminder Settings Type and Storage, Rationale: reminder settings device-only, excluded from .c12f backup, RemindersState, SetEnabledResult, appLock.ts (mirrored pattern), DEFAULT_REMINDER_SETTINGS, DueReminderPayload, isValidReminderDaysBefore() (+14 more)

### Community 12 - "Currency Input & Adjustment Panel Components"

Cohesion: 0.13
Nodes (20): Task 032-03: Migrate Monetary Fields, CurrencyInputProps, styles, draftFromAmount(), EditableAmountInput(), EditableAmountInputProps, adjustmentModeColor(), AdjustmentPanel() (+12 more)

### Community 13 - "Currency Mask & Add Account From Payments"

Cohesion: 0.11
Nodes (25): app-context.md Currency input section, app-context.md Pagamentos section, Plan 026: Add Account from Payments, Plan 032: Currency Input Mask, Spec 026: Add Account from Payments, Spec 032: Currency Input Mask, Task 026-01: Add State Helper and Action, Task 026-02: Redesign Payments Header (+17 more)

### Community 14 - "Expo App Config (app.json)"

Cohesion: 0.09
Nodes (22): backgroundColor, foregroundImage, adaptiveIcon, package, predictiveBackGestureEnabled, softwareKeyboardLayoutMode, versionCode, expo (+14 more)

### Community 15 - "Salary Distribution, Spending Trends & Goal Specs"

Cohesion: 0.13
Nodes (23): docs/app-context.md, Plan 033: Salary Distribution Panel, Plan 035: Spending Trends and Averages Plan, Plan 036: Commitment Goal Plan, Spec 033: Salary Distribution Panel, Spec 035: Spending Trends and Averages, Spec 036: Commitment Goal, Task 033-01: Add Salary Distribution Builder (+15 more)

### Community 16 - "Bar Chart Components & Gifted Chart Adapters"

Cohesion: 0.17
Nodes (16): CategoryBarChart(), CategoryBarChartProps, styles, formatCurrencyAxisLabel(), MonthlyBarChart(), MonthlyBarChartProps, styles, CategoryChartPoint (+8 more)

### Community 17 - "App Shell & Tab Bar"

Cohesion: 0.14
Nodes (18): Task 034-05: Add useReminders Hook and Lembretes Section, AppLockOverlay(), styles, TabBar(), TabBarProps, TabIconName, TabItem, AppTab (+10 more)

### Community 18 - "Monthly Value Editor & Inline Adjust Panel"

Cohesion: 0.14
Nodes (19): Plan: Planejar Painel de Ajuste Inline (±), Design: Painel de Ajuste Inline no MonthlyValueEditor, SelectField(), SelectFieldProps, SelectOption, styles, AdjustPanel(), AdjustPanelProps (+11 more)

### Community 19 - "Summary Panels & Formatters"

Cohesion: 0.17
Nodes (16): CategoryTotalsList(), CategoryTotalsListProps, styles, MonthDetailsPanel(), MonthDetailsPanelProps, styles, PaymentSummaryPanel(), PaymentSummaryPanelProps (+8 more)

### Community 20 - "Chart Panel & Salary Distribution UI"

Cohesion: 0.16
Nodes (14): ChartPanel(), ChartPanelProps, styles, MonthlyCommitmentListProps, styles, SalaryDistributionPanel(), SalaryDistributionPanelProps, styles (+6 more)

### Community 21 - "Icon/Splash & Reminders Specs (023,034,037)"

Cohesion: 0.11
Nodes (19): Android Notification Icon (notification-icon.png), Adaptive Icon Foreground Asset, Android Native Launcher/Splash Resources, Spec 023 - App Icon and Splash Alignment, app.json icon/splash config, assets/novo temporary source folder, Splash Screen Configuration, AccountItem.dueDay (+11 more)

### Community 22 - "Hide Values & Currency Mask Plan Concepts"

Cohesion: 0.13
Nodes (19): docs/app-context.md, EyeIcon component, Plan 025 - Hide Values Toggle, maskCurrency helper, valuesHidden state / eye-toggle mechanism, Plan 032 - Currency Input Mask, react-native-currency-input dependency, Plan 033 - Salary Distribution Panel (+11 more)

### Community 23 - "Typography & Icon/Splash Tasks (022-023)"

Cohesion: 0.20
Nodes (18): Plan 022: Typography Standardization Plan, Plan 023: App Icon and Splash Alignment Plan, Spec 022: Typography Standardization, Spec 023: App Icon and Splash Alignment, Task 022-01: Add Typography Standardization Docs, Task 022-03: Migrate Shared And Shell Typography, Task 022-04: Migrate Finance Typography, Task 022-05: Validate Typography Standardization (+10 more)

### Community 24 - "Root Docs (AGENTS/CLAUDE/README) & Reminders Tasks"

Cohesion: 0.19
Nodes (17): AGENTS.md, Notifications.setNotificationHandler() startup config, CLAUDE.md (root), Plan 024 - App Context Documentation, Plan 034: Due Date Reminders Plan, Spec 034: Due Date Reminders, docs/standards/app-context-policy.md, Task 034-01: Add Notifications Dependency (+9 more)

### Community 25 - "Commitment Color & Dark Theme (009-010)"

Cohesion: 0.22
Nodes (17): Dark finance theme color tokens, Plan 009: Commitment Color Thresholds Plan, Plan 010: Dark Finance Theme Plan, Spec 009: Commitment Color Thresholds, Spec 010: Dark Finance Theme, Task 009-01: Add Plan and Tasks, Task 009-02: Update Data Model, Task 009-03: Add Commitment Color Helper (+9 more)

### Community 26 - "Lint/Test Tooling Dependencies"

Cohesion: 0.12
Nodes (17): eslint, eslint-plugin-react-native, jest, lint-staged, devDependencies, eslint, eslint-plugin-react-native, jest (+9 more)

### Community 27 - "App Lock Hook, Lib & Storage"

Cohesion: 0.28
Nodes (12): AppLockState, AUTH_PROMPT_OPTIONS, EnableAppLockResult, APP_LOCK_TIMEOUT_OPTIONS, AppLockSettings, DEFAULT_APP_LOCK_SETTINGS, isValidAppLockTimeout(), normalizeAppLockSettings() (+4 more)

### Community 28 - "Month History & Goal Plan Concepts"

Cohesion: 0.18
Nodes (16): HistoryCard component, Plan 030 - Month History, MonthHistoryEntry type / monthHistory field, SummaryScreen component (Resumo), Plan 031 - Quick Add Extra Balance, Plan 035 - Spending Trends and Averages, GoalTag component, MonthSummaryCard (Projeção) (+8 more)

### Community 29 - "Spending Trends & Commitment Goal Spec Concepts"

Cohesion: 0.13
Nodes (16): resolveCommitmentColor helper (reused), categoryVariation helper, computeCategoryAverages helper, computeTotalTrend helper, HistoryCard (per-category variation), Spec 035 - Spending Trends and Averages, src/lib/spendingTrends.ts, SummaryScreen (trend line) (+8 more)

### Community 30 - "NPM Scripts"

Cohesion: 0.12
Nodes (16): scripts, android, check, dup, format, format:check, ios, lint (+8 more)

### Community 31 - "Architecture Refactor & App Lock Plan Concepts"

Cohesion: 0.14
Nodes (15): App.tsx Modularization, Plan 004 - React Native Architecture Refactor, useFinanceState Hook, Plan 005 - Test Coverage And Quality Metrics, Vitest V8 Coverage, Plan 020 - App Lock, AppLockOverlay, src/storage/appLockStorage.ts (+7 more)

### Community 32 - "Code Quality Tooling (016)"

Cohesion: 0.21
Nodes (14): Plan 016: Code Quality Tooling, Spec 016: Code Quality Tooling, .editorconfig, ESLint (Expo-compatible config), Prettier config and ignore file, Task 016-01: Add Quality Tooling, Jest (with Expo config), React Native Testing Library (+6 more)

### Community 33 - "Summary Visibility & Sorting Plan Concepts"

Cohesion: 0.17
Nodes (13): Payment Status Tracking (paymentStatuses), Plan 006 - Summary Visibility And Payment Status, Compact Management Panels, Plan 007 - Sorting And Compact Management Panels, Sorting Helpers, Contas Screen, Figma Design System, Plan 021 - Figma Layout Refresh (+5 more)

### Community 34 - "Add Account & God Hook Refactor Specs"

Cohesion: 0.15
Nodes (13): AccountItem type, Spec 026 - Add Account from Payments Screen, buildAccountItemWithValueState helper, createAccountItemAndSetValue action, MonthlyValue type, useFinanceState (createAccountItemAndSetValue), AccountsScreen, CategoriesScreen (+5 more)

### Community 35 - "TypeScript & Jest Config Refs"

Cohesion: 0.15
Nodes (12): expo/tsconfig.base, jest, jest.setup.ts, **/\*.js, **/_.ts, \*\*/_.tsx, compilerOptions, noEmit (+4 more)

### Community 36 - "Core Feature Plan Concepts (persistence, tabs, backup)"

Cohesion: 0.20
Nodes (12): Local Data Persistence, Four-Tab Workflow (Resumo/Planejamento/Categorias/Ajustes), Ajustes to Configurações Label Rename, Plan 012 - Settings Tab Label, .c12f Backup Format, Plan 014 - Data Backup Restore Reset, Gerenciar Dados Panel, SHA-256 Detects Casual Changes, Not Strong Anti-Forgery (+4 more)

### Community 37 - "Due Date Reminders Plan Concepts"

Cohesion: 0.18
Nodes (12): buildDueReminders helper, Plan 034 - Due Date Reminders, syncReminders function, useAppLock hook, useReminders hook, Spec 034 - Due Date Reminders, getMonthlyValueAmount helper, isAccountItemPaid helper (+4 more)

### Community 38 - "App Context Documentation & Balance Spec Concepts"

Cohesion: 0.17
Nodes (12): Spec 024 - App Context Documentation, docs/app-context.md, docs/standards/app-context-policy.md, README Human-Readable Product Overview, calculateAvailableIncome (reused), Spec 038 - Account Balance Reconciliation, calculateAccountBalance helper, calculateAvailableIncome (reused) (+4 more)

### Community 39 - "Gifted Charts Concepts"

Cohesion: 0.42
Nodes (11): Gifted balance (surplus/shortfall) column chart, Gifted category donut chart, Gifted chart data adapter helpers, Gifted expense line/area chart, react-native-gifted-charts dependency, Plan 011: Gifted Charts Visual Upgrade Plan, Spec 011: Gifted Charts Visual Upgrade, Task 011-01: Add Gifted Charts Dependencies (+3 more)

### Community 40 - "Tabbed Workflow & Rolling Window Concepts"

Cohesion: 0.20
Nodes (11): Plan 003 - Tabbed Finance Workflow, visibleMonthCount Setting, FinanceSettings, Category Value Propagation, Plan 018 - Rolling Window and Category Propagation, summaryVisibleMonthCount, 12-Month Rolling Window, Categories Default to Zero Propagation to Avoid Silently Copying History (+3 more)

### Community 41 - "Commitment Calculation Plan Concepts"

Cohesion: 0.20
Nodes (11): Current-Month Commitment Calculation, calculateIncomeCommitmentPercentage, Plan 009 - Commitment Color Thresholds, CurrencyInput, MonthSummaryCard, normalizeFinanceState, resolveCommitmentColor, SettingsScreen (+3 more)

### Community 42 - "Splash & Notifications Config"

Cohesion: 0.24
Nodes (10): android/app/src/main/AndroidManifest.xml, app.json, assets/splash-finance.png splash image, expo-splash-screen plugin, Plan 013: Splash Screen Branding Plan, expo-notifications dependency, Plan 037 - Android Notification Icon, assets/notification-icon.png (+2 more)

### Community 43 - "Backup/Restore Concepts (014)"

Cohesion: 0.47
Nodes (10): .c12f backup envelope format, Gerenciar Dados data management panel, Plan 014: Data Backup, Restore, Reset Plan, Spec 014: Data Backup, Restore, Reset, Task 014-01: Add Backup File Dependencies, Task 014-02: Add Backup Validation Helpers, Task 014-03: Add Finance State Replace Action, Task 014-04: Add Data Management UI (+2 more)

### Community 44 - "Commitment Goal Plan Concepts (036)"

Cohesion: 0.20
Nodes (10): resolveCommitmentColor (existing, deliberately not reused), Plan 036 - Commitment Goal, commitmentGoal setting, commitmentWarningThreshold / commitmentDangerThreshold settings, MonthlyCommitmentList (Gráficos), resolveGoalStatus helper, updateCommitmentGoal action, Spec 036 - Commitment Goal (+2 more)

### Community 45 - "financeCalculations.ts Concepts"

Cohesion: 0.27
Nodes (10): calculateAccountBalance helper, calculateAvailableIncome helper, calculateCategoryTotals helper, calculateMonthlyTotalExpenses helper, calculateSurplusOrShortfall helper, src/lib/financeCalculations.ts, getCategoryColor helper, sortCategories helper (+2 more)

### Community 46 - "Monthly Value Adjustment (015)"

Cohesion: 0.42
Nodes (9): Monthly adjustment add/subtract UI controls, Plan 015: Monthly Value Adjustments Plan, Spec 015: Monthly Value Adjustments, Task 015-01: Add Adjustment Helper, Task 015-02: Add Finance State Adjustment Action, Task 015-03: Add Monthly Adjustment UI, Task 015-04: Update Docs And Validate, Finance state adjustment action (+1 more)

### Community 47 - "Currency Mask Spec Concepts (032)"

Cohesion: 0.25
Nodes (9): EditableAmountInput component, Spec 032 - Currency Input Mask, CurrencyInput (wraps EditableAmountInput), src/lib/currencyMask.ts (hand-rolled helpers, removed), EditableAmountInput (masked), monthlyValueAdjustments.ts (numeric flow), MonthlyValueEditor (Planejar), parseCurrencyInput (non-typing paths) (+1 more)

### Community 48 - "Month History & Salary Distribution Spec Concepts"

Cohesion: 0.22
Nodes (9): SummaryScreen (Histórico pill), SummaryScreen (quick add extra modal), buildSalaryDistribution helper, calculateCategoryTotal (reused), CategoryBarChart (Gráficos, unchanged), getCategoryColor (reused), Spec 033 - Salary Distribution Panel, SalaryDistributionPanel component (+1 more)

### Community 49 - "Duplication Policy & ModalShell Component"

Cohesion: 0.22
Nodes (8): Code Duplication Policy, 5% Duplication Threshold Rule, ModalShell(), ModalShellProps, styles, SummaryValue(), financeStateFixtures.ts, sharedStyles.ts

### Community 50 - "Settings Screen & Currency Input"

Cohesion: 0.22
Nodes (7): CurrencyInput(), formatReminderDaysBefore(), HOUR_OPTIONS, MINUTE_OPTIONS, MONTH_COUNT_OPTIONS, SettingsScreenProps, styles

### Community 51 - "Eye Icon & Hide Values Spec Concepts"

Cohesion: 0.25
Nodes (8): Eye Closed Icon (Hide Values Toggle), Eye Open Icon (Show Values Toggle), EyeIcon component, FinanceApp.tsx greeting row, Spec 025 - Hide Values Toggle, maskCurrency helper, SummaryScreen (masked values), valuesHidden state

### Community 52 - "Charts Tab & Gifted Charts Plan Concepts"

Cohesion: 0.29
Nodes (8): Plan 008 - Finance Charts Tab, Gráficos Tab, View-based Bar Charts, Chart Data Adapters, Plan 011 - Gifted Charts Visual Upgrade, react-native-gifted-charts, Spec 008: Finance Charts Tab, Spec 011: Gifted Charts Visual Upgrade

### Community 53 - "Monthly Adjustment & Installment Plan Concepts"

Cohesion: 0.29
Nodes (8): Monthly Value Adjustment Helper (+/-), Plan 015 - Monthly Value Adjustments, adjustMonthlyValue, Plan 019 - Installment Value Entry, installmentMonths Helper, MonthlyValueEditor, Parcelas Field, Spec 015: Monthly Value Adjustments

### Community 54 - "Add Account Plan Concepts"

Cohesion: 0.32
Nodes (8): Plan 026 - Add Account from Payments Screen, buildAccountItemWithValueState helper, createAccountItemAndSetValue action, parseCurrencyInput helper, parseDueDay helper, addCurrentMonthExtraBalance action, src/lib/inputParsers.ts, useFinanceState.ts

### Community 55 - "Action Button & App Lock Overlay"

Cohesion: 0.32
Nodes (5): ActionButton(), ActionButtonProps, styles, AppLockOverlayProps, styles

### Community 56 - "App Entry & Notifications Lib"

Cohesion: 0.29
Nodes (3): App(), NotificationsModule, stub

### Community 57 - "Bootstrap & Local Projection Plan Concepts (001-002)"

Cohesion: 0.29
Nodes (7): Plan 001 - Bootstrap Expo Project, Expo Blank TypeScript Template, Finance Calculation Helpers, Plan 002 - Local 12-Month Finance Projection, 12-Month Projection, Spec 001: Bootstrap Expo Project, Spec 002: Local Finance Projection

### Community 58 - "Splash & Icon Plan Concepts"

Cohesion: 0.33
Nodes (7): assets/splash-finance.png Splash Asset, Plan 013 - Splash Screen Branding, Adaptive Icon Assets (app-icon.png, adaptive-icon-foreground.png, splash-logo.png), Android Native Resource Alignment, Plan 023 - App Icon and Splash Alignment, Light Adaptive Icon Chosen to Avoid Black Launcher Result, Spec 013: Splash Screen Branding

### Community 59 - "Payment Checklist Spec Concepts (cross-spec)"

Cohesion: 0.33
Nodes (7): CurrentMonthPaymentChecklist (masked values), CurrentMonthPaymentChecklist (Adicionar conta), Spec 029 - Adjust Account Value from Payments Screen, adjustMonthlyValue action, calculateAdjustedMonthlyValue helper, CurrentMonthPaymentChecklist (± adjustment), src/lib/monthlyValueAdjustments.ts

### Community 60 - "Month History Spec Concepts"

Cohesion: 0.29
Nodes (7): advanceWindow function, HistoryCard component, Spec 030 - Month History, FinanceState.monthHistory field, MonthHistoryEntry type, MonthlyValue/MonthlyPaymentStatus records dropped on advance, src/lib/windowAdvance.ts

### Community 61 - "Extra Balance Spec Concepts"

Cohesion: 0.29
Nodes (7): addCurrentMonthExtraBalance action, advanceWindowOneStep (resets extra balance), CurrencyInput component (reused), currentMonthExtraBalance field, maskCurrency helper (reused), parseCurrencyInput helper (reused), Spec 031 - Quick Add Extra Balance

### Community 62 - "Coverage Config & Formatter Tests (005)"

Cohesion: 0.62
Nodes (7): Task 005-01 - Configure Vitest Coverage, Vitest Coverage Configuration (npm run test:coverage), docs/quality/coverage-baseline.md, Task 005-02 - Record Coverage Baseline, Task 005-03 - Update Docs And Validate, src/lib/formatters.ts, Task 005-04 - Test Formatters

### Community 63 - "ESLint Config Concepts"

Cohesion: 0.29
Nodes (6): eslintConfigPrettier, expoConfig, prettierPlugin, reactHooksPlugin, reactNativePlugin, typescriptPlugin

### Community 64 - "Dark Theme & Typography Plan Concepts"

Cohesion: 0.40
Nodes (6): Plan 010 - Dark Finance Theme, Shared Color Tokens, Typography Audit: 101 fontSize / 83 fontWeight / 16 lineHeight Declarations, Plan 022 - Typography Standardization, Typography Tokens (src/theme/typography.ts), Spec 010: Dark Finance Theme

### Community 65 - "Adjust Account Value From Payments (029)"

Cohesion: 0.47
Nodes (6): Plan 029: Adjust Account Value from Payments, Spec 029: Adjust Account Value from Payments, Task 029-01: Add Adjustment UI to Payment Checklist, Task 029-02: Wire Adjust Action in Parent, Task 029-03: Update Docs and Validate, README.md Pagamentos adjustment description

### Community 66 - "Safe Area Insets (028)"

Cohesion: 0.33
Nodes (6): App.tsx root wrapper, FinanceApp.tsx header paddingTop, react-native-safe-area-context dependency, Spec 028 - Safe Area Insets, SafeAreaProvider wrapper, useSafeAreaInsets hook usage

### Community 67 - "Bootstrap Expo Project Tasks (001)"

Cohesion: 0.90
Nodes (5): Plan 001 - Bootstrap Expo Project, Create Expo Project, Create Home Screen, Update README, Validate Bootstrap Project

### Community 68 - "Settings Tab Label (012)"

Cohesion: 0.50
Nodes (5): Plan 012: Settings Tab Label Plan, Spec 012: Settings Tab Label, Task 012-01: Rename Settings Tab Label, FinanceApp component (tab labels), TabBar component

### Community 69 - "Code Quality Tooling Plan Concepts"

Cohesion: 0.40
Nodes (5): Plan 016 - Code Quality Tooling, ESLint/Prettier Tooling, Husky + lint-staged Pre-commit Hooks, Jest + React Native Testing Library Migration, Spec 016: Code Quality Tooling

### Community 70 - "Adjust Value & Spec 015 Concepts"

Cohesion: 0.60
Nodes (5): Plan 029 - Adjust Account Value from Payments Screen, adjustMonthlyValue action, calculateAdjustedMonthlyValue helper, Spec 015 (adjustment infrastructure), Spec 029 - Adjust Account Value from Payments

### Community 71 - "Extract Components/App Shell Tasks (004)"

Cohesion: 0.50
Nodes (5): Finance-specific Components (src/components/finance/), Task 004-04 - Extract Finance Components, Screens Directory and Reduced App.tsx Shell, Task 004-05 - Extract Screens And App Shell, Task 004-06 - Update Docs And Validate

### Community 72 - "Package Metadata"

Cohesion: 0.40
Nodes (4): main, name, private, version

### Community 73 - "Lint-Staged Config"

Cohesion: 0.50
Nodes (5): lint-staged, _.{js,jsx,ts,tsx}, _.{json,md}, eslint --fix, prettier --write

### Community 74 - "Android Centered Splash Plugin"

Cohesion: 0.40
Nodes (3): fs, path, { withDangerousMod }

### Community 76 - "Charts Screen Mockups (graficos-o1/o2/o2.1)"

Cohesion: 0.67
Nodes (3): Graficos Screen Mockup Option 1 (Sobra ou Falta por Mes Bar Chart), Graficos Screen - Design Option 2.1 (Mobile Mockup), Gráficos Screen - Option 2 (Charts)

## Ambiguous Edges - Review These

- `Task 032-01: Add Currency Mask Helpers` → `digits-to-cents helper (inferred name)` [AMBIGUOUS]
  docs/tasks/032-01-add-currency-mask-helpers.md · relation: implements
- `Task 032-01: Add Currency Mask Helpers` → `cents-to-display formatter (inferred name)` [AMBIGUOUS]
  docs/tasks/032-01-add-currency-mask-helpers.md · relation: implements

## Knowledge Gaps

- **425 isolated node(s):** `husky.sh script`, `name`, `slug`, `version`, `orientation` (+420 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Task 032-01: Add Currency Mask Helpers` and `digits-to-cents helper (inferred name)`?**
  _Edge tagged AMBIGUOUS (relation: implements) - confidence is low._
- **What is the exact relationship between `Task 032-01: Add Currency Mask Helpers` and `cents-to-display formatter (inferred name)`?**
  _Edge tagged AMBIGUOUS (relation: implements) - confidence is low._
- **Why does `AGENTS.md (Project Agent Rules)` connect `App Context Documentation` to `Duplication Policy & ModalShell Component`, `Early Architecture Specs & Standards (001-005)`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `Code Duplication Policy` connect `Duplication Policy & ModalShell Component` to `Chart Panel & Salary Distribution UI`, `App Context Documentation`, `Currency Input & Adjustment Panel Components`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `CurrentMonthPaymentChecklist()` connect `Currency Input & Adjustment Panel Components` to `Finance Calculations & Category/Account Editors`, `App Context Documentation`, `Adjust Value & Spec 015 Concepts`, `Currency Mask & Add Account From Payments`, `App Shell & Tab Bar`, `Monthly Value Editor & Inline Adjust Panel`, `Summary Panels & Formatters`, `Add Account Plan Concepts`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `husky.sh script`, `name`, `slug` to the rest of the system?**
  _430 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Finance Calculations & Category/Account Editors` be split into smaller, more focused modules?**
  _Cohesion score 0.051425899953249185 - nodes in this community are weakly interconnected._
