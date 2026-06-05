import {
  BACKUP_FORMAT_VERSION,
  BackupEnvelope,
  buildResetFinanceState,
  createBackupEnvelope,
  parseAndValidateBackupContent,
  serializeBackupEnvelope,
} from './financeBackup';
import { FinanceState } from '../types/finance';

const sampleState: FinanceState = {
  accountItems: [
    {
      categoryId: 'category-fixed',
      dueDay: 10,
      id: 'account-rent',
      name: 'Aluguel',
      sortOrder: 0,
    },
  ],
  categories: [
    {
      id: 'category-fixed',
      name: 'Fixos',
      sortOrder: 0,
    },
  ],
  monthlyValues: [
    {
      accountItemId: 'account-rent',
      amount: 1200,
      month: 6,
      year: 2026,
    },
  ],
  paymentStatuses: [
    {
      accountItemId: 'account-rent',
      isPaid: true,
      month: 6,
      year: 2026,
    },
  ],
  settings: {
    commitmentDangerThreshold: 80,
    commitmentWarningThreshold: 60,
    currentMonthExtraBalance: 250,
    monthlySalary: 5000,
    visibleMonthCount: 12,
  },
};

describe('financeBackup', () => {
  it('creates and validates a backup envelope', async () => {
    const envelope = await createBackupEnvelope(
      sampleState,
      testHash,
      '2026-06-05T12:00:00.000Z',
    );
    const restoredState = await parseAndValidateBackupContent(
      serializeBackupEnvelope(envelope),
      testHash,
    );

    expect(envelope.formatVersion).toBe(BACKUP_FORMAT_VERSION);
    expect(restoredState).toEqual(sampleState);
  });

  it('rejects invalid JSON content', async () => {
    await expect(parseAndValidateBackupContent('{bad-json', testHash)).rejects.toThrow(
      'JSON válido',
    );
  });

  it('rejects unsupported backup versions', async () => {
    const envelope = await createBackupEnvelope(sampleState, testHash);
    const unsupportedEnvelope: BackupEnvelope = {
      ...envelope,
      formatVersion: 999 as BackupEnvelope['formatVersion'],
    };

    await expect(
      parseAndValidateBackupContent(
        serializeBackupEnvelope(unsupportedEnvelope),
        testHash,
      ),
    ).rejects.toThrow('Versão');
  });

  it('rejects content changed after export', async () => {
    const envelope = await createBackupEnvelope(sampleState, testHash);
    const changedEnvelope: BackupEnvelope = {
      ...envelope,
      data: {
        ...envelope.data,
        monthlyValues: [{ ...envelope.data.monthlyValues[0], amount: 999 }],
      },
    };

    await expect(
      parseAndValidateBackupContent(serializeBackupEnvelope(changedEnvelope), testHash),
    ).rejects.toThrow('alterado');
  });

  it('rejects invalid references before restore', async () => {
    const invalidState: FinanceState = {
      ...sampleState,
      accountItems: [
        {
          ...sampleState.accountItems[0],
          categoryId: 'category-missing',
        },
      ],
    };
    const envelope = await createBackupEnvelope(invalidState, testHash);

    await expect(
      parseAndValidateBackupContent(serializeBackupEnvelope(envelope), testHash),
    ).rejects.toThrow('categoria inexistente');
  });

  it('builds the documented reset defaults', () => {
    expect(buildResetFinanceState()).toEqual({
      accountItems: [],
      categories: [{ id: 'category-outros', name: 'Outros', sortOrder: 0 }],
      monthlyValues: [],
      paymentStatuses: [],
      settings: {
        commitmentDangerThreshold: 80,
        commitmentWarningThreshold: 60,
        currentMonthExtraBalance: 0,
        monthlySalary: 0,
        visibleMonthCount: 12,
      },
    });
  });
});

function testHash(payload: string): string {
  return `test-hash:${payload.length}:${payload}`;
}
