import { colors } from './colors';
import { radius } from './radius';
import { shadows } from './shadows';
import { space, spacing } from './spacing';
import { fonts, fontSizes, fontWeights, lineHeights, textStyles } from './typography';

export const theme = {
  colors,
  spacing,
  space,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  textStyles,
  radius,
  shadows,
};

export type Theme = typeof theme;
