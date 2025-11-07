import { vi } from './vi';
import { en } from './en';
import { ja } from './ja';

export const locales = {
  vi,
  en,
  ja,
} as const;

export type Locale = keyof typeof locales;
export type LocaleKeys = typeof locales.vi;
