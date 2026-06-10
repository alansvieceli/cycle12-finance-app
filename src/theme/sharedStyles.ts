import { StyleSheet } from 'react-native';

import { colors } from './colors';
import { typography } from './typography';

/** Card-like panel container shared by editor and chart sections. */
export const panelStyles = StyleSheet.create({
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
  emptyText: {
    color: colors.textSecondary,
    marginTop: 10,
    ...typography.body,
  },
});

/** List rows and inline create form shared by the category and account editors. */
export const editorStyles = StyleSheet.create({
  listSection: {
    marginBottom: 10,
    marginTop: 12,
  },
  listItem: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  compactRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingVertical: 8,
  },
  itemName: {
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 0,
    ...typography.body,
  },
  expandedContent: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 8,
    paddingBottom: 10,
    paddingTop: 10,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textPrimary,
    letterSpacing: 0,
    minHeight: 44,
    paddingHorizontal: 12,
    ...typography.inputCompact,
  },
  createToggle: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 14,
  },
  createToggleOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  createToggleText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.body,
  },
  createToggleIcon: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  createForm: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  createInput: {
    flex: 1,
  },
});

/** Input and action buttons shared by form modals. */
export const modalFormStyles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textPrimary,
    letterSpacing: 0,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...typography.input,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 96,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.button,
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 12,
  },
  confirmButtonText: {
    color: colors.accentText,
    letterSpacing: 0,
    ...typography.button,
  },
});
