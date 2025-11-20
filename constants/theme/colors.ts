export const colors = {
  // base tokens
  night: '#121212',          // bg
  eerieBlack: '#1e1e1e',     // containers (card/navs)
  jet: '#2a2a2a',            // dividers / neutrals
  pureWhite: '#ffffff',      // text primary
  silver: '#b0b0b0',         // text secondary
  safetyOrange: '#ff7a00',   // primary base
  pigmentGreen: '#4caf50',   // success
  hunyadiYellow: '#ffb74d',  // warning
  vermillion: '#f44336',     // error

  // primary palette
  primary: '#ff7a00',        // $color-primary
  primaryDark: '#bf5c00',    // color.scale($color-primary, $lightness: -25%)
  primaryLight: '#ff9b40',   // color.scale($color-primary, $lightness: 25%)

  // neutrals
  neutral: '#2a2a2a',        // $color-neutral

  // accents
  success: '#4caf50',
  successLight: '#a5d8a7',   // color.scale($color-success, $lightness: 50%)
  warning: '#ffb74d',
  warningLight: '#ffdba6',   // color.scale($color-warning, $lightness: 50%)
  error: '#f44336',
  errorLight: '#faa19a',     // color.scale($color-error, $lightness: 50%)

  // text
  textPrimary: '#ffffff',
  textSecondary: '#b0b0b0',

  // backgrounds
  bgMain: '#121212',
  bgCard: '#1e1e1e',
  bgCardLight: '#292929',    // color.scale($color-bg-card, $lightness: 5%)
} as const;

export type ColorName = keyof typeof colors;
