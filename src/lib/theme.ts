import { useColorScheme } from 'react-native';

const light = {
  bg: '#F4F5F7',
  surface: '#FFFFFF',
  ink: '#14171F',
  inkInv: '#FFFFFF',
  muted: '#6B7280',
  line: '#E5E7EB',
  accent: '#1F6FEB',
  accentSoft: '#E6EFFD',
  ok: '#14804A',
  okSoft: '#E3F5EA',
  warn: '#B25E09',
  warnSoft: '#FDF1E1',
  bad: '#C62828',
  badSoft: '#FCE8E8',
};

const dark: typeof light = {
  bg: '#0E1116',
  surface: '#171B22',
  ink: '#EEF1F5',
  inkInv: '#0E1116',
  muted: '#9AA3AF',
  line: '#2A303A',
  accent: '#5B9BFF',
  accentSoft: '#1A2A44',
  ok: '#4CC38A',
  okSoft: '#13291F',
  warn: '#F0A54A',
  warnSoft: '#33240F',
  bad: '#FF6B6B',
  badSoft: '#3A1717',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
