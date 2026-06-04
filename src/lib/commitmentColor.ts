export function resolveCommitmentColor(
  commitment: number | null,
  warningThreshold: number,
  dangerThreshold: number,
): string | null {
  if (commitment === null) {
    return null;
  }

  if (dangerThreshold > 0 && commitment > dangerThreshold / 100) {
    return '#d9534f';
  }

  if (warningThreshold > 0 && commitment > warningThreshold / 100) {
    return '#f0a500';
  }

  return null;
}
