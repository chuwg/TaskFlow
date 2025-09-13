// 기본 팔레트
export const palette = {
  purple: {
    light: '#BB86FC',
    main: '#6200EE',
    dark: '#3700B3',
  },
  blue: {
    light: '#4FC3F7',
    main: '#2196F3',
    dark: '#1976D2',
  },
  green: {
    light: '#81C784',
    main: '#4CAF50',
    dark: '#388E3C',
  },
  orange: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },
  red: {
    light: '#E57373',
    main: '#F44336',
    dark: '#D32F2F',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

// 라이트 테마 색상
export const lightColors = {
  // 기본 색상
  primary: palette.purple.main,
  primaryContainer: palette.purple.light,
  secondary: palette.blue.main,
  secondaryContainer: palette.blue.light,
  background: palette.grey[50],
  surface: '#FFFFFF',
  error: palette.red.main,
  errorContainer: palette.red.light,
  
  // 텍스트 색상
  onPrimary: '#FFFFFF',
  onPrimaryContainer: palette.purple.dark,
  onSecondary: '#FFFFFF',
  onSecondaryContainer: palette.blue.dark,
  onBackground: palette.grey[900],
  onSurface: palette.grey[900],
  onError: '#FFFFFF',
  onErrorContainer: palette.red.dark,
  
  // 추가 상태 색상
  success: palette.green.main,
  warning: palette.orange.main,
  info: palette.blue.main,
  
  // 추가 컴포넌트 색상
  card: '#FFFFFF',
  border: palette.grey[200],
  
  // 투명도가 있는 색상
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
  
  // 기타 MD3 필수 색상
  outline: palette.grey[400],
  surfaceVariant: palette.grey[100],
  onSurfaceVariant: palette.grey[700],
};

// 다크 테마 색상
export const darkColors = {
  // 기본 색상
  primary: palette.purple.light,
  primaryContainer: palette.purple.dark,
  secondary: palette.blue.light,
  secondaryContainer: palette.blue.dark,
  background: '#121212',
  surface: '#1E1E1E',
  error: palette.red.light,
  errorContainer: palette.red.dark,
  
  // 텍스트 색상
  onPrimary: '#000000',
  onPrimaryContainer: palette.purple.light,
  onSecondary: '#000000',
  onSecondaryContainer: palette.blue.light,
  onBackground: '#FFFFFF',
  onSurface: '#FFFFFF',
  onError: '#000000',
  onErrorContainer: palette.red.light,
  
  // 추가 상태 색상
  success: palette.green.light,
  warning: palette.orange.light,
  info: palette.blue.light,
  
  // 추가 컴포넌트 색상
  card: '#1E1E1E',
  border: palette.grey[800],
  
  // 투명도가 있는 색상
  overlay: 'rgba(255, 255, 255, 0.1)',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  
  // 기타 MD3 필수 색상
  outline: palette.grey[600],
  surfaceVariant: palette.grey[800],
  onSurfaceVariant: palette.grey[300],
};
