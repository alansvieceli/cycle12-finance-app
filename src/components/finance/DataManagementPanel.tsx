import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { calculateSha256 } from '../../lib/backupCrypto';
import {
  BACKUP_FILE_EXTENSION,
  BackupValidationError,
  buildResetFinanceState,
  createBackupEnvelope,
  parseAndValidateBackupContent,
  serializeBackupEnvelope,
} from '../../lib/financeBackup';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { FinanceState } from '../../types/finance';
import { ActionButton } from '../common/ActionButton';

type DataManagementPanelProps = {
  financeState: FinanceState;
  onClose: () => void;
  onReplaceFinanceState: (financeState: FinanceState) => void;
};

export function DataManagementPanel({
  financeState,
  onClose,
  onReplaceFinanceState,
}: DataManagementPanelProps) {
  const [message, setMessage] = useState('');
  const [activeAction, setActiveAction] = useState<'backup' | 'restore' | null>(null);
  const isBusy = activeAction !== null;

  async function handleBackup() {
    if (isBusy) {
      return;
    }

    setActiveAction('backup');
    setMessage('');

    try {
      const envelope = await createBackupEnvelope(financeState, calculateSha256);
      const content = serializeBackupEnvelope(envelope);
      const fileName = `cycle12-finance-backup-${formatFileDate(
        envelope.exportedAt,
      )}${BACKUP_FILE_EXTENSION}`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (!(await Sharing.isAvailableAsync())) {
        setMessage(`Backup criado em ${fileUri}`);
        return;
      }

      await Sharing.shareAsync(fileUri, {
        dialogTitle: 'Backup Cycle12 Finance',
        mimeType: 'application/json',
        UTI: 'public.json',
      });
      setMessage('Backup criado e pronto para salvar ou compartilhar.');
    } catch {
      setMessage('Não foi possível criar o backup agora.');
    } finally {
      setActiveAction(null);
    }
  }

  async function handleRestore() {
    if (isBusy) {
      return;
    }

    setActiveAction('restore');
    setMessage('');

    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: '*/*',
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      if (!asset) {
        setMessage('Nenhum arquivo selecionado.');
        return;
      }

      if (asset.name && !asset.name.toLowerCase().endsWith(BACKUP_FILE_EXTENSION)) {
        setMessage('Selecione um arquivo de backup .c12f.');
        return;
      }

      const content = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const restoredState = await parseAndValidateBackupContent(
        content,
        calculateSha256,
      );

      onReplaceFinanceState(restoredState);
      setMessage('Backup restaurado com sucesso.');
    } catch (error) {
      setMessage(
        error instanceof BackupValidationError
          ? error.message
          : 'Não foi possível restaurar o backup.',
      );
    } finally {
      setActiveAction(null);
    }
  }

  function handleReset() {
    if (isBusy) {
      return;
    }

    Alert.alert(
      'Confirmar limpeza',
      'Isso vai apagar os dados atuais deste dispositivo e recriar apenas os valores padrão. Deseja continuar?',
      [
        { style: 'cancel', text: 'Cancelar' },
        {
          onPress: () => {
            onReplaceFinanceState(buildResetFinanceState());
            setMessage('Dados limpos e valores padrão recriados.');
          },
          style: 'destructive',
          text: 'Limpar tudo',
        },
      ],
    );
  }

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.sectionTitle}>Backup e restauração</Text>
          <Text style={styles.description}>
            Salve, restaure ou limpe os dados locais deste app.
          </Text>
        </View>
        <ActionButton
          icon="arrow-back"
          label="Voltar"
          onPress={onClose}
          variant="secondary"
        />
      </View>

      <View style={styles.actions}>
        <ActionButton
          label={activeAction === 'backup' ? 'Processando...' : 'Fazer backup'}
          onPress={handleBackup}
        />
        <ActionButton
          label={activeAction === 'restore' ? 'Processando...' : 'Restaurar backup'}
          onPress={handleRestore}
        />
        <ActionButton
          label="Limpar tudo"
          onPress={handleReset}
          variant="ghost-danger"
        />
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

function formatFileDate(isoDate: string): string {
  return isoDate.slice(0, 10);
}

const styles = StyleSheet.create({
  actions: {
    gap: 10,
    marginTop: 16,
  },
  description: {
    color: colors.textSecondary,
    marginTop: 6,
    ...typography.bodySmall,
  },
  header: {
    gap: 12,
  },
  message: {
    color: colors.textSecondary,
    marginTop: 12,
    ...typography.bodySmall,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
  titleGroup: {
    flexShrink: 1,
  },
});
