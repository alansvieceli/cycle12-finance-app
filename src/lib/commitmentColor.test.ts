import { resolveCommitmentColor } from './commitmentColor';
import { colors } from '../theme/colors';

describe('resolveCommitmentColor', () => {
  it('returns null when commitment is null', () => {
    expect(resolveCommitmentColor(null, 80, 90)).toBeNull();
  });

  it('returns danger color when commitment exceeds danger threshold', () => {
    expect(resolveCommitmentColor(0.95, 80, 90)).toBe(colors.commitmentHigh);
  });

  it('returns warning color when commitment exceeds warning but not danger threshold', () => {
    expect(resolveCommitmentColor(0.85, 80, 90)).toBe(colors.commitmentMedium);
  });

  it('returns null when commitment is below both thresholds', () => {
    expect(resolveCommitmentColor(0.7, 80, 90)).toBeNull();
  });

  it('treats danger threshold of 0 as disabled', () => {
    expect(resolveCommitmentColor(0.99, 80, 0)).toBe(colors.commitmentMedium);
  });

  it('treats warning threshold of 0 as disabled', () => {
    expect(resolveCommitmentColor(0.85, 0, 90)).toBeNull();
  });

  it('treats both thresholds of 0 as disabled', () => {
    expect(resolveCommitmentColor(0.99, 0, 0)).toBeNull();
  });

  it('danger takes priority when warning threshold equals danger threshold', () => {
    expect(resolveCommitmentColor(0.95, 90, 90)).toBe(colors.commitmentHigh);
  });

  it('returns null when commitment equals the threshold exactly (strict greater-than)', () => {
    // exactly at danger threshold — not strictly greater, so no danger color
    // but still above warning threshold, so returns warning
    expect(resolveCommitmentColor(0.9, 80, 90)).toBe(colors.commitmentMedium);
    // exactly at warning threshold — not strictly greater, so returns null
    expect(resolveCommitmentColor(0.8, 80, 90)).toBeNull();
  });
});
