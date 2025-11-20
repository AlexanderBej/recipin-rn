export const fonts = {
  heading: 'Lato', // will map to loaded font family
  body: 'Inter',
  mono: 'Roboto Mono',
} as const;

export const fontSizes = {
  xxl: 64,     // 4rem
  xl: 48,      // 3rem
  h1: 32,      // 2rem
  h2: 24,      // 1.5rem
  h3: 20,      // 1.25rem
  body: 16,    // 1rem
  small: 14,   // 0.875rem
  xsmall: 11,  // 0.688rem
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeights = {
  base: 1.5,     // used as multiplier
  heading: 1.2,
};

// Helpers to apply RN-style text styles
export const textStyles = {
  heading1: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold as any,
    lineHeight: fontSizes.h1 * lineHeights.heading,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular as any,
    lineHeight: fontSizes.body * lineHeights.base,
  },
};
