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

// Helper to deep merge objects with fallback
function deepMerge(target: any, fallback: any): any {
  if (typeof target !== 'object' || target === null) {
    return target !== undefined ? target : fallback;
  }

  if (Array.isArray(target)) {
    return target.length > 0 ? target : fallback;
  }

  const result = { ...fallback, ...target };
  
  // For keys present in fallback but missing/undefined in target, use fallback
  // For keys present in both, if they are objects, merge them recursively
  for (const key in fallback) {
    if (typeof fallback[key] === 'object' && fallback[key] !== null && !Array.isArray(fallback[key])) {
      result[key] = deepMerge(target[key], fallback[key]);
    }
  }

  return result;
}

// Helper function to get translation with fallback to EN
export function getTranslation(lang: Language = 'en'): TranslationKeys {
  const selected = translations[lang];
  const fallback = translations.en;
  
  if (lang === 'en') return fallback;
  
  return deepMerge(selected, fallback);
}
