import { en } from './en';
import { ms } from './ms';
import { zh } from './zh';

export type TranslationKeys = typeof en;

export const translations = {
  en,
  ms,
  zh,
};

export type Language = keyof typeof translations;

// Helper function to get translation
export function getTranslation(lang: Language = 'en'): TranslationKeys {
  return translations[lang] || translations.en;
}
