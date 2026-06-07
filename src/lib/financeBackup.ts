import { normalizeFinanceState } from '../storage/financeStorage';
import {
  AccountItem,
  Category,
  CategoryPropagation,
  FinanceSettings,
  FinanceState,
  MonthHistoryEntry,
  MonthNumber,
  MonthlyPaymentStatus,
  MonthlyValue,
  createDefaultFinanceSettings,
} from '../types/finance';

export const BACKUP_FORMAT = 'cycle12-finance-backup';
export const BACKUP_FORMAT_VERSION = 1;
export const BACKUP_STORAGE_VERSION = 2;
export const BACKUP_FILE_EXTENSION = '.c12f';

const BACKUP_HASH_ALGORITHM = 'SHA-256';
const RESET_CATEGORY_ID = 'category-outros';

type BackupIntegrity = {
  algorithm: typeof BACKUP_HASH_ALGORITHM;
  canonicalPayloadHash: string;
};

export type BackupEnvelope = {
  app: {
    name: 'Cycle12 Finance';
    storageVersion: typeof BACKUP_STORAGE_VERSION;
  };
  data: FinanceState;
  exportedAt: string;
  format: typeof BACKUP_FORMAT;
  formatVersion: typeof BACKUP_FORMAT_VERSION;
  integrity: BackupIntegrity;
};

type BackupPayload = Omit<BackupEnvelope, 'integrity'>;

export type BackupHashFunction = (payload: string) => Promise<string> | string;

export class BackupValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BackupValidationError';
  }
}

export function buildResetFinanceState(): FinanceState {
  const defaultSettings = createDefaultFinanceSettings();

  return {
    accountItems: [],
    categories: [
      {
        id: RESET_CATEGORY_ID,
        name: 'Outros',
        propagation: 'zero',
        sortOrder: 9,
      },
    ],
    monthHistory: [],
    monthlyValues: [],
    paymentStatuses: [],
    settings: defaultSettings,
  };
}

export async function createBackupEnvelope(
  financeState: FinanceState,
  hashPayload: BackupHashFunction,
  exportedAt = new Date().toISOString(),
): Promise<BackupEnvelope> {
  const payload: BackupPayload = {
    app: {
      name: 'Cycle12 Finance',
      storageVersion: BACKUP_STORAGE_VERSION,
    },
    data: normalizeFinanceState(financeState),
    exportedAt,
    format: BACKUP_FORMAT,
    formatVersion: BACKUP_FORMAT_VERSION,
  };
  const canonicalPayloadHash = await hashPayload(canonicalStringify(payload));

  return {
    ...payload,
    integrity: {
      algorithm: BACKUP_HASH_ALGORITHM,
      canonicalPayloadHash,
    },
  };
}

export function serializeBackupEnvelope(envelope: BackupEnvelope): string {
  return JSON.stringify(envelope, null, 2);
}

export async function parseAndValidateBackupContent(
  content: string,
  hashPayload: BackupHashFunction,
): Promise<FinanceState> {
  let parsedContent: unknown;

  try {
    parsedContent = JSON.parse(content);
  } catch {
    throw new BackupValidationError('Arquivo de backup não é um JSON válido.');
  }

  const envelope = assertBackupEnvelope(parsedContent);
  const { integrity, ...payload } = envelope;
  const expectedHash = await hashPayload(canonicalStringify(payload));

  if (integrity.canonicalPayloadHash !== expectedHash) {
    throw new BackupValidationError(
      'Arquivo de backup foi alterado ou está corrompido.',
    );
  }

  return validateFinanceState(envelope.data);
}

export function canonicalStringify(value: unknown): string {
  return JSON.stringify(sortCanonicalValue(value));
}

function sortCanonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortCanonicalValue);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((sortedObject, key) => {
        sortedObject[key] = sortCanonicalValue((value as Record<string, unknown>)[key]);
        return sortedObject;
      }, {});
  }

  return value;
}

function assertBackupEnvelope(value: unknown): BackupEnvelope {
  if (!isRecord(value)) {
    throw new BackupValidationError('Arquivo de backup inválido.');
  }

  if (value.format !== BACKUP_FORMAT) {
    throw new BackupValidationError('Formato de backup inválido.');
  }

  if (value.formatVersion !== BACKUP_FORMAT_VERSION) {
    throw new BackupValidationError('Versão de backup não suportada.');
  }

  if (!isRecord(value.app) || value.app.name !== 'Cycle12 Finance') {
    throw new BackupValidationError('Aplicativo de origem inválido.');
  }

  if (!isRecord(value.integrity)) {
    throw new BackupValidationError('Integridade do backup ausente.');
  }

  if (value.integrity.algorithm !== BACKUP_HASH_ALGORITHM) {
    throw new BackupValidationError('Algoritmo de integridade não suportado.');
  }

  if (typeof value.integrity.canonicalPayloadHash !== 'string') {
    throw new BackupValidationError('Hash de integridade inválido.');
  }

  if (typeof value.exportedAt !== 'string') {
    throw new BackupValidationError('Data de exportação inválida.');
  }

  if (!isRecord(value.data)) {
    throw new BackupValidationError('Dados financeiros ausentes.');
  }

  return value as BackupEnvelope;
}

function validateFinanceState(value: unknown): FinanceState {
  if (!isRecord(value)) {
    throw new BackupValidationError('Dados financeiros inválidos.');
  }

  const settings = validateSettings(value.settings);
  const categories = validateCategories(value.categories);
  const categoryIds = new Set(categories.map((category) => category.id));
  const accountItems = validateAccountItems(value.accountItems, categoryIds);
  const accountItemIds = new Set(accountItems.map((accountItem) => accountItem.id));
  const monthlyValues = validateMonthlyValues(value.monthlyValues, accountItemIds);
  const paymentStatuses = validatePaymentStatuses(
    value.paymentStatuses,
    accountItemIds,
  );
  const monthHistory = validateMonthHistory(value.monthHistory);

  return normalizeFinanceState({
    accountItems,
    categories,
    monthHistory,
    monthlyValues,
    paymentStatuses,
    settings,
  });
}

function validateMonthHistory(value: unknown): MonthHistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: MonthHistoryEntry[] = [];

  for (const entry of value) {
    if (!isRecord(entry)) continue;

    const month = typeof entry.month === 'number' ? entry.month : null;
    const year = typeof entry.year === 'number' ? entry.year : null;
    const totalIncome =
      typeof entry.totalIncome === 'number' ? entry.totalIncome : null;
    const totalExpenses =
      typeof entry.totalExpenses === 'number' ? entry.totalExpenses : null;

    if (
      month === null ||
      year === null ||
      totalIncome === null ||
      totalExpenses === null ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      continue;
    }

    const categories = Array.isArray(entry.categories)
      ? entry.categories
          .filter(isRecord)
          .filter(
            (c) =>
              typeof c.id === 'string' &&
              typeof c.name === 'string' &&
              typeof c.total === 'number',
          )
          .map((c) => ({
            id: c.id as string,
            name: c.name as string,
            color: typeof c.color === 'string' ? c.color : undefined,
            sortOrder: typeof c.sortOrder === 'number' ? c.sortOrder : undefined,
            total: c.total as number,
          }))
      : [];

    const accounts = Array.isArray(entry.accounts)
      ? entry.accounts
          .filter(isRecord)
          .filter(
            (a) =>
              typeof a.id === 'string' &&
              typeof a.name === 'string' &&
              typeof a.categoryId === 'string' &&
              typeof a.amount === 'number',
          )
          .map((a) => ({
            id: a.id as string,
            name: a.name as string,
            categoryId: a.categoryId as string,
            dueDay: typeof a.dueDay === 'number' ? a.dueDay : undefined,
            amount: a.amount as number,
          }))
      : [];

    result.push({
      month: month as MonthNumber,
      year,
      totalIncome,
      totalExpenses,
      categories,
      accounts,
    });
  }

  return result;
}

function validateSettings(value: unknown): FinanceSettings {
  if (!isRecord(value)) {
    throw new BackupValidationError('Configurações do backup inválidas.');
  }

  const defaultSettings = createDefaultFinanceSettings();

  return {
    commitmentDangerThreshold: validatePercent(
      value.commitmentDangerThreshold,
      'Perigo de comprometimento inválido.',
    ),
    commitmentWarningThreshold: validatePercent(
      value.commitmentWarningThreshold,
      'Alerta de comprometimento inválido.',
    ),
    currentMonthExtraBalance: validateNumber(
      value.currentMonthExtraBalance,
      'Extra do mês atual inválido.',
    ),
    monthlySalary: validateNumber(value.monthlySalary, 'Salário mensal inválido.'),
    summaryVisibleMonthCount: validateOptionalVisibleMonthCount(
      value.summaryVisibleMonthCount ?? value.visibleMonthCount,
    ),
    windowStartMonth:
      value.windowStartMonth === undefined
        ? defaultSettings.windowStartMonth
        : validateMonth(value.windowStartMonth),
    windowStartYear:
      value.windowStartYear === undefined
        ? defaultSettings.windowStartYear
        : validateNumber(value.windowStartYear, 'Ano da janela inválido.'),
  };
}

function validateCategories(value: unknown): Category[] {
  if (!Array.isArray(value)) {
    throw new BackupValidationError('Categorias do backup inválidas.');
  }

  return value.map((category) => {
    if (!isRecord(category)) {
      throw new BackupValidationError('Categoria do backup inválida.');
    }

    return {
      installmentEndDate:
        typeof category.installmentEndDate === 'string'
          ? category.installmentEndDate
          : undefined,
      id: validateString(category.id, 'Categoria sem identificador válido.'),
      name: validateString(category.name, 'Categoria sem nome válido.'),
      propagation:
        category.propagation === undefined
          ? 'zero'
          : validateCategoryPropagation(category.propagation),
      sortOrder: validateNumber(category.sortOrder, 'Ordem da categoria inválida.'),
    };
  });
}

function validateCategoryPropagation(value: unknown): CategoryPropagation {
  if (value === 'fixed' || value === 'zero' || value === 'installment') {
    return value;
  }

  throw new BackupValidationError('Propagação da categoria inválida.');
}

function validateAccountItems(value: unknown, categoryIds: Set<string>): AccountItem[] {
  if (!Array.isArray(value)) {
    throw new BackupValidationError('Contas do backup inválidas.');
  }

  return value.map((accountItem) => {
    if (!isRecord(accountItem)) {
      throw new BackupValidationError('Conta do backup inválida.');
    }

    const categoryId = validateString(
      accountItem.categoryId,
      'Conta com categoria inválida.',
    );

    if (!categoryIds.has(categoryId)) {
      throw new BackupValidationError('Conta aponta para categoria inexistente.');
    }

    return {
      categoryId,
      dueDay: validateNumber(accountItem.dueDay, 'Vencimento da conta inválido.'),
      id: validateString(accountItem.id, 'Conta sem identificador válido.'),
      name: validateString(accountItem.name, 'Conta sem nome válido.'),
      sortOrder: validateNumber(accountItem.sortOrder, 'Ordem da conta inválida.'),
    };
  });
}

function validateMonthlyValues(
  value: unknown,
  accountItemIds: Set<string>,
): MonthlyValue[] {
  if (!Array.isArray(value)) {
    throw new BackupValidationError('Valores mensais do backup inválidos.');
  }

  return value.map((monthlyValue) => {
    if (!isRecord(monthlyValue)) {
      throw new BackupValidationError('Valor mensal do backup inválido.');
    }

    const accountItemId = validateString(
      monthlyValue.accountItemId,
      'Valor mensal com conta inválida.',
    );

    if (!accountItemIds.has(accountItemId)) {
      throw new BackupValidationError('Valor mensal aponta para conta inexistente.');
    }

    return {
      accountItemId,
      amount: validateNumber(monthlyValue.amount, 'Valor mensal inválido.'),
      month: validateMonth(monthlyValue.month),
      year: validateNumber(monthlyValue.year, 'Ano do valor mensal inválido.'),
    };
  });
}

function validatePaymentStatuses(
  value: unknown,
  accountItemIds: Set<string>,
): MonthlyPaymentStatus[] {
  if (!Array.isArray(value)) {
    throw new BackupValidationError('Pagamentos do backup inválidos.');
  }

  return value.map((paymentStatus) => {
    if (!isRecord(paymentStatus)) {
      throw new BackupValidationError('Pagamento do backup inválido.');
    }

    const accountItemId = validateString(
      paymentStatus.accountItemId,
      'Pagamento com conta inválida.',
    );

    if (!accountItemIds.has(accountItemId)) {
      throw new BackupValidationError('Pagamento aponta para conta inexistente.');
    }

    if (typeof paymentStatus.isPaid !== 'boolean') {
      throw new BackupValidationError('Status de pagamento inválido.');
    }

    return {
      accountItemId,
      isPaid: paymentStatus.isPaid,
      month: validateMonth(paymentStatus.month),
      year: validateNumber(paymentStatus.year, 'Ano do pagamento inválido.'),
    };
  });
}

function validateString(value: unknown, message: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new BackupValidationError(message);
  }

  return value;
}

function validateNumber(value: unknown, message: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new BackupValidationError(message);
  }

  return value;
}

function validatePercent(value: unknown, message: string): number {
  const numericValue = validateNumber(value, message);

  if (numericValue < 0 || numericValue > 100) {
    throw new BackupValidationError(message);
  }

  return numericValue;
}

function validateVisibleMonthCount(value: unknown): number {
  const numericValue = validateNumber(value, 'Meses de visualização inválido.');

  if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 12) {
    throw new BackupValidationError('Meses de visualização inválido.');
  }

  return numericValue;
}

function validateOptionalVisibleMonthCount(value: unknown): number {
  return value === undefined ? 12 : validateVisibleMonthCount(value);
}

function validateMonth(value: unknown): MonthNumber {
  const numericValue = validateNumber(value, 'Mês do backup inválido.');

  if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 12) {
    throw new BackupValidationError('Mês do backup inválido.');
  }

  return numericValue as MonthNumber;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
