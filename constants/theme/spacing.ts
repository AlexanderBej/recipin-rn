export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
} as const;

// optional semantic aliases
export const space = {
  xs: spacing[1],
  sm: spacing[2],
  md: spacing[4],
  lg: spacing[5],
  xl: spacing[6],
  xxl: spacing[7],
} as const;
