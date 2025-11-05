// Typography system with proper hierarchy
export const typography = {
  // Font Families (using system defaults, can be customized with expo-font)
  fontFamily: {
    regular: 'System', // Will use Roboto on Android, SF Pro on iOS
    medium: 'System',
    bold: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Text Styles
  styles: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 38,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 30,
      letterSpacing: -0.2,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 26,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 27,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 21,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
      letterSpacing: 0.3,
    },
  },
};

