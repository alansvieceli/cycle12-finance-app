import {
  BACKUP_FORMAT_VERSION,
  BackupEnvelope,
  buildResetFinanceState,
  canonicalStringify,
  createBackupEnvelope,
  parseAndValidateBackupContent,
  serializeBackupEnvelope,
} from './financeBackup';
import { FinanceState, MonthNumber } from '../types/finance';

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
      propagation: 'zero',
      sortOrder: 0,
    },
  ],
  monthHistory: [],
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
    summaryVisibleMonthCount: 12,
    windowStartMonth: 6,
    windowStartYear: 2026,
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
      categories: [
        {
          id: 'category-outros',
          name: 'Outros',
          propagation: 'zero',
          sortOrder: 9,
        },
      ],
      monthHistory: [],
      monthlyValues: [],
      paymentStatuses: [],
      settings: {
        commitmentDangerThreshold: 90,
        commitmentWarningThreshold: 70,
        currentMonthExtraBalance: 0,
        monthlySalary: 0,
        summaryVisibleMonthCount: 12,
        windowStartMonth: expect.any(Number),
        windowStartYear: expect.any(Number),
      },
    });
  });
});

function testHash(payload: string): string {
  return `test-hash:${payload.length}:${payload}`;
}

function buildEnvelopeJson(data: unknown): string {
  const payload = {
    app: { name: 'Cycle12 Finance', storageVersion: 2 },
    data,
    exportedAt: '2026-06-01T00:00:00.000Z',
    format: 'cycle12-finance-backup',
    formatVersion: 1,
  };
  return JSON.stringify({
    ...payload,
    integrity: {
      algorithm: 'SHA-256',
      canonicalPayloadHash: testHash(canonicalStringify(payload)),
    },
  });
}

const validData = {
  accountItems: [],
  categories: [],
  monthlyValues: [],
  paymentStatuses: [],
  settings: {
    commitmentDangerThreshold: 80,
    commitmentWarningThreshold: 60,
    currentMonthExtraBalance: 0,
    monthlySalary: 5000,
    summaryVisibleMonthCount: 12,
    windowStartMonth: 6,
    windowStartYear: 2026,
  },
};

describe('assertBackupEnvelope', () => {
  it('rejects a non-object top-level value', async () => {
    await expect(parseAndValidateBackupContent('[]', testHash)).rejects.toThrow(
      'backup inválido',
    );
  });

  it('rejects wrong format field', async () => {
    const json = JSON.stringify({
      format: 'wrong',
      formatVersion: 1,
      app: { name: 'Cycle12 Finance' },
      integrity: { algorithm: 'SHA-256', canonicalPayloadHash: 'x' },
      exportedAt: '2026-01-01',
      data: {},
    });
    await expect(parseAndValidateBackupContent(json, testHash)).rejects.toThrow(
      'Formato de backup inválido',
    );
  });

  it('rejects wrong app name', async () => {
    const json = JSON.stringify({
      format: 'cycle12-finance-backup',
      formatVersion: 1,
      app: { name: 'Other App' },
      integrity: { algorithm: 'SHA-256', canonicalPayloadHash: 'x' },
      exportedAt: '2026-01-01',
      data: {},
    });
    await expect(parseAndValidateBackupContent(json, testHash)).rejects.toThrow(
      'origem inválido',
    );
  });

  it('rejects missing integrity field', async () => {
    const json = JSON.stringify({
      format: 'cycle12-finance-backup',
      formatVersion: 1,
      app: { name: 'Cycle12 Finance' },
      integrity: null,
      exportedAt: '2026-01-01',
      data: {},
    });
    await expect(parseAndValidateBackupContent(json, testHash)).rejects.toThrow(
      'Integridade do backup ausente',
    );
  });

  it('rejects unsupported hash algorithm', async () => {
    const json = JSON.stringify({
      format: 'cycle12-finance-backup',
      formatVersion: 1,
      app: { name: 'Cycle12 Finance' },
      integrity: { algorithm: 'MD5', canonicalPayloadHash: 'x' },
      exportedAt: '2026-01-01',
      data: {},
    });
    await expect(parseAndValidateBackupContent(json, testHash)).rejects.toThrow(
      'Algoritmo de integridade não suportado',
    );
  });

  it('rejects non-string hash value', async () => {
    const json = JSON.stringify({
      format: 'cycle12-finance-backup',
      formatVersion: 1,
      app: { name: 'Cycle12 Finance' },
      integrity: { algorithm: 'SHA-256', canonicalPayloadHash: 123 },
      exportedAt: '2026-01-01',
      data: {},
    });
    await expect(parseAndValidateBackupContent(json, testHash)).rejects.toThrow(
      'Hash de integridade inválido',
    );
  });

  it('rejects non-string exportedAt', async () => {
    const json = JSON.stringify({
      format: 'cycle12-finance-backup',
      formatVersion: 1,
      app: { name: 'Cycle12 Finance' },
      integrity: { algorithm: 'SHA-256', canonicalPayloadHash: 'x' },
      exportedAt: 12345,
      data: {},
    });
    await expect(parseAndValidateBackupContent(json, testHash)).rejects.toThrow(
      'Data de exportação inválida',
    );
  });

  it('rejects non-record data field', async () => {
    const json = JSON.stringify({
      format: 'cycle12-finance-backup',
      formatVersion: 1,
      app: { name: 'Cycle12 Finance' },
      integrity: { algorithm: 'SHA-256', canonicalPayloadHash: 'x' },
      exportedAt: '2026-01-01',
      data: [],
    });
    await expect(parseAndValidateBackupContent(json, testHash)).rejects.toThrow(
      'Dados financeiros ausentes',
    );
  });
});

describe('validateFinanceState — field errors', () => {
  it('rejects non-record settings', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({ ...validData, settings: null }),
        testHash,
      ),
    ).rejects.toThrow('Configurações do backup inválidas');
  });

  it('rejects non-number salary', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({
          ...validData,
          settings: { ...validData.settings, monthlySalary: 'x' },
        }),
        testHash,
      ),
    ).rejects.toThrow('Salário mensal inválido');
  });

  it('rejects commitment threshold above 100', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({
          ...validData,
          settings: { ...validData.settings, commitmentWarningThreshold: 101 },
        }),
        testHash,
      ),
    ).rejects.toThrow('Alerta de comprometimento inválido');
  });

  it('rejects commitment threshold below 0', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({
          ...validData,
          settings: { ...validData.settings, commitmentDangerThreshold: -1 },
        }),
        testHash,
      ),
    ).rejects.toThrow('Perigo de comprometimento inválido');
  });

  it('rejects summaryVisibleMonthCount out of range', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({
          ...validData,
          settings: { ...validData.settings, summaryVisibleMonthCount: 0 },
        }),
        testHash,
      ),
    ).rejects.toThrow('Meses de visualização inválido');
  });

  it('rejects summaryVisibleMonthCount above 12', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({
          ...validData,
          settings: { ...validData.settings, summaryVisibleMonthCount: 13 },
        }),
        testHash,
      ),
    ).rejects.toThrow('Meses de visualização inválido');
  });

  it('rejects windowStartMonth out of range', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({
          ...validData,
          settings: { ...validData.settings, windowStartMonth: 13 },
        }),
        testHash,
      ),
    ).rejects.toThrow('Mês do backup inválido');
  });

  it('rejects non-array categories', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({ ...validData, categories: null }),
        testHash,
      ),
    ).rejects.toThrow('Categorias do backup inválidas');
  });

  it('rejects non-record category entry', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({ ...validData, categories: ['bad'] }),
        testHash,
      ),
    ).rejects.toThrow('Categoria do backup inválida');
  });

  it('rejects category with invalid propagation value', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({
          ...validData,
          categories: [{ id: 'c1', name: 'Cat', sortOrder: 0, propagation: 'unknown' }],
        }),
        testHash,
      ),
    ).rejects.toThrow('Propagação da categoria inválida');
  });

  it('rejects non-array account items', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({ ...validData, accountItems: null }),
        testHash,
      ),
    ).rejects.toThrow('Contas do backup inválidas');
  });

  it('rejects non-record account item entry', async () => {
    const dataWithCategory = {
      ...validData,
      categories: [{ id: 'c1', name: 'Cat', sortOrder: 0, propagation: 'zero' }],
      accountItems: ['bad'],
    };
    await expect(
      parseAndValidateBackupContent(buildEnvelopeJson(dataWithCategory), testHash),
    ).rejects.toThrow('Conta do backup inválida');
  });

  it('rejects non-array monthly values', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({ ...validData, monthlyValues: null }),
        testHash,
      ),
    ).rejects.toThrow('Valores mensais do backup inválidos');
  });

  it('rejects non-record monthly value entry', async () => {
    const dataWithAccount = {
      ...validData,
      categories: [{ id: 'c1', name: 'Cat', sortOrder: 0, propagation: 'zero' }],
      accountItems: [
        { id: 'a1', categoryId: 'c1', name: 'A', dueDay: 5, sortOrder: 0 },
      ],
      monthlyValues: ['bad'],
    };
    await expect(
      parseAndValidateBackupContent(buildEnvelopeJson(dataWithAccount), testHash),
    ).rejects.toThrow('Valor mensal do backup inválido');
  });

  it('rejects monthly value pointing to nonexistent account', async () => {
    const dataWithOrphan = {
      ...validData,
      monthlyValues: [{ accountItemId: 'missing', amount: 100, month: 6, year: 2026 }],
    };
    await expect(
      parseAndValidateBackupContent(buildEnvelopeJson(dataWithOrphan), testHash),
    ).rejects.toThrow('conta inexistente');
  });

  it('rejects non-array payment statuses', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({ ...validData, paymentStatuses: null }),
        testHash,
      ),
    ).rejects.toThrow('Pagamentos do backup inválidos');
  });

  it('rejects non-record payment status entry', async () => {
    const dataWithAccount = {
      ...validData,
      categories: [{ id: 'c1', name: 'Cat', sortOrder: 0, propagation: 'zero' }],
      accountItems: [
        { id: 'a1', categoryId: 'c1', name: 'A', dueDay: 5, sortOrder: 0 },
      ],
      paymentStatuses: ['bad'],
    };
    await expect(
      parseAndValidateBackupContent(buildEnvelopeJson(dataWithAccount), testHash),
    ).rejects.toThrow('Pagamento do backup inválido');
  });

  it('rejects payment status pointing to nonexistent account', async () => {
    const dataWithOrphan = {
      ...validData,
      paymentStatuses: [
        { accountItemId: 'missing', isPaid: true, month: 6, year: 2026 },
      ],
    };
    await expect(
      parseAndValidateBackupContent(buildEnvelopeJson(dataWithOrphan), testHash),
    ).rejects.toThrow('conta inexistente');
  });

  it('rejects payment status with non-boolean isPaid', async () => {
    const dataWithAccount = {
      ...validData,
      categories: [{ id: 'c1', name: 'Cat', sortOrder: 0, propagation: 'zero' }],
      accountItems: [
        { id: 'a1', categoryId: 'c1', name: 'A', dueDay: 5, sortOrder: 0 },
      ],
      paymentStatuses: [{ accountItemId: 'a1', isPaid: 'yes', month: 6, year: 2026 }],
    };
    await expect(
      parseAndValidateBackupContent(buildEnvelopeJson(dataWithAccount), testHash),
    ).rejects.toThrow('Status de pagamento inválido');
  });

  it('rejects category with empty string name', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({
          ...validData,
          categories: [{ id: 'c1', name: '   ', sortOrder: 0, propagation: 'zero' }],
        }),
        testHash,
      ),
    ).rejects.toThrow('Categoria sem nome válido');
  });

  it('rejects account item with non-finite dueDay', async () => {
    await expect(
      parseAndValidateBackupContent(
        buildEnvelopeJson({
          ...validData,
          categories: [{ id: 'c1', name: 'Cat', sortOrder: 0, propagation: 'zero' }],
          accountItems: [
            { id: 'a1', categoryId: 'c1', name: 'A', dueDay: NaN, sortOrder: 0 },
          ],
        }),
        testHash,
      ),
    ).rejects.toThrow('Vencimento da conta inválido');
  });

  it('preserves monthHistory through a backup round-trip', async () => {
    const stateWithHistory = {
      ...sampleState,
      monthHistory: [
        {
          month: 5 as MonthNumber,
          year: 2026,
          totalIncome: 5000,
          totalExpenses: 3200,
          categories: [
            { id: 'category-fixed', name: 'Fixos', color: '#FF0000', total: 3200 },
          ],
          accounts: [
            {
              id: 'account-rent',
              name: 'Aluguel',
              categoryId: 'category-fixed',
              amount: 3200,
            },
          ],
        },
      ],
    };
    const envelope = await createBackupEnvelope(
      stateWithHistory,
      testHash,
      '2026-06-05T12:00:00.000Z',
    );
    const restoredState = await parseAndValidateBackupContent(
      serializeBackupEnvelope(envelope),
      testHash,
    );

    expect(restoredState.monthHistory).toEqual(stateWithHistory.monthHistory);
  });

  it('restores monthHistory as [] when field is missing from backup', async () => {
    const dataWithoutHistory = { ...validData };
    const restoredState = await parseAndValidateBackupContent(
      buildEnvelopeJson(dataWithoutHistory),
      testHash,
    );

    expect(restoredState.monthHistory).toEqual([]);
  });
});
