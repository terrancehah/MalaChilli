import { Globe } from 'lucide-react';
import type { Language } from '../../translations';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ms', label: 'Bahasa Malaysia' },
    { code: 'zh', label: '中文' },
  ];

  return (
    <div className="relative inline-block">
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => {
          const currentIndex = languages.findIndex(l => l.code === language);
          const nextIndex = (currentIndex + 1) % languages.length;
          onLanguageChange(languages[nextIndex].code);
        }}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{languages.find(l => l.code === language)?.label}</span>
      </button>
    </div>
  );
}
