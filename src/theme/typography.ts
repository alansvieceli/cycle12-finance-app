const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '700',
  bold: '800',
  heavy: '900',
} as const;

export const typography = {
  screenTitle: {
    fontSize: 24,
    fontWeight: fontWeights.semibold,
    lineHeight: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    lineHeight: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    lineHeight: 22,
  },
  amountLarge: {
    fontSize: 30,
    fontWeight: fontWeights.heavy,
    lineHeight: 36,
  },
  amountMedium: {
    fontSize: 18,
    fontWeight: fontWeights.heavy,
    lineHeight: 24,
  },
  amountSmall: {
    fontSize: 14,
    fontWeight: fontWeights.bold,
    lineHeight: 20,
  },
  body: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: fontWeights.semibold,
    lineHeight: 17,
  },
  label: {
    fontSize: 11,
    fontWeight: fontWeights.heavy,
    lineHeight: 15,
  },
  button: {
    fontSize: 13,
    fontWeight: fontWeights.bold,
    lineHeight: 18,
  },
  tab: {
    fontSize: 12,
    fontWeight: fontWeights.bold,
    lineHeight: 16,
  },
  caption: {
    fontSize: 11,
    fontWeight: fontWeights.bold,
    lineHeight: 15,
  },
  input: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    lineHeight: 22,
  },
  inputCompact: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    lineHeight: 20,
  },
} as const;
