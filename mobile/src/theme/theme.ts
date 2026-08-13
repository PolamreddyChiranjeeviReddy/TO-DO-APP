export const colors = {
  primary: '#4F6DF5',
  primaryDark: '#3B55D4',
  primaryLight: '#EEF1FE',
  background: '#F5F6FA',
  surface: '#FFFFFF',
  text: '#1C1C28',
  textSecondary: '#6B6B7B',
  textMuted: '#9A9AA8',
  border: '#E2E3EA',
  danger: '#E5484D',
  dangerLight: '#FDECEC',
  success: '#30A46C',
  successLight: '#E7F6EF',
  warning: '#D97706',
  warningLight: '#FCF3E3',
  white: '#FFFFFF',
  disabled: '#C4C5D0',
  overlay: 'rgba(28, 28, 40, 0.5)',
};

export const priorityColors: Record<string, string> = {
  LOW: '#30A46C',
  MEDIUM: '#D97706',
  HIGH: '#E5484D',
};

// Subtle elevation used on cards and floating elements
export const shadows = {
  card: {
    shadowColor: '#1C1C28',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  raised: {
    shadowColor: '#1C1C28',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 22,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 30,
};

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
