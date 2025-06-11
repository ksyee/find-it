/**
 * 디자인 시스템 토큰
 * 색상, 폰트, 스페이싱 등 디자인 시스템의 핵심 값들을 정의합니다.
 */

export const colors = {
  // 주요 브랜드 색상
  primary: {
    light: '#6b9fff',
    main: '#4785FF',
    dark: '#3469cc',
    contrastText: '#FFFFFF',
  },
  
  // 보조 색상
  secondary: {
    light: '#a3a3a3',
    main: '#989898',
    dark: '#777777',
    contrastText: '#FFFFFF',
  },
  
  // 의미적 색상
  semantic: {
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
  },
  
  // 배경 색상
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    disabled: '#E5E5E5',
  },
  
  // 텍스트 색상
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
    hint: '#BCBCBC',
  },
  
  // 테두리 색상
  border: {
    default: '#E0E0E0',
    focus: '#4785FF',
    error: '#FF3B30',
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  '3xl': '48px',
  '4xl': '64px',
};

export const fontSizes = {
  xs: '10px',
  sm: '12px',
  md: '14px',
  lg: '16px',
  xl: '18px',
  xxl: '20px',
  '3xl': '24px',
  '4xl': '32px',
};

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
};

export const borderRadius = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '24px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const transitions = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
};

// 미디어 쿼리 브레이크포인트
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

// z-index 관리
export const zIndex = {
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};
