import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import type { Language } from "../../translations";
import { cn } from "../../lib/utils";

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSelector({
  language,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "ms", label: "Bahasa Malaysia" },
    { code: "zh", label: "中文" },
  ];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={containerRef}>
      {isOpen ? (
        <div className="absolute right-0 top-0 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={cn(
                "w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-50",
                language === lang.code
                  ? "text-primary font-bold bg-primary/10"
                  : "text-gray-700"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      ) : (
        <button
          className="h-12 flex items-center gap-2 px-4 py-2 text-sm bg-white hover:bg-gray-50 text-primary rounded-xl transition-all hover:-translate-y-0.5 border-0 shadow-lg"
          onClick={() => setIsOpen(true)}
          title="Change Language"
        >
          <Globe className="h-5 w-5" />
          <span className="hidden sm:inline font-medium">
            {languages.find((l) => l.code === language)?.label}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
