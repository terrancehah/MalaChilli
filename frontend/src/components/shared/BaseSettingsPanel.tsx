import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../ui/button';
import { X, LogOut } from 'lucide-react';
import { getTranslation, type Language } from '../../translations';

interface BaseSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSignOut: () => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  children: ReactNode;
}

export function BaseSettingsPanel({
  isOpen,
  onClose,
  title,
  onSignOut,
  language,
  onLanguageChange,
  children
}: BaseSettingsPanelProps) {
  const t = getTranslation(language);
  const [isClosing, setIsClosing] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languageLabels = {
    en: 'English',
    ms: 'Bahasa Malaysia',
    zh: '中文'
  };

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      onClose();
      setIsClosing(false);
    }
  };

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity ${
          isClosing 
            ? 'opacity-0 duration-300 pointer-events-none' 
            : 'opacity-100 duration-200'
        }`}
        onClick={handleClose}
      />
      
      {/* Settings Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-2xl border-l border-border overflow-y-auto ${
          isClosing ? 'animate-out slide-out-to-right duration-300' : 'animate-in slide-in-from-right duration-300'
        }`}
        onAnimationEnd={handleAnimationEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="relative mb-6">
            <h3 className="text-xl font-bold text-foreground leading-none pt-2">{title}</h3>
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 h-6 w-6 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Custom Content */}
          {children}

          {/* Preferences Section */}
          <div className="mb-6">
            <h4 className="text-base font-bold text-foreground mb-4">{t.settings.preferences}</h4>
            <div className="space-y-3">
              <div className="relative">
                <button 
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">{t.settings.language}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{languageLabels[language]}</p>
                  </div>
                  <span className="text-muted-foreground text-xs">▼</span>
                </button>
                {showLanguageMenu && onLanguageChange && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowLanguageMenu(false)}
                    />
                    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-background rounded-lg shadow-xl border border-border overflow-hidden">
                      <button
                        onClick={() => {
                          onLanguageChange('en');
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors ${
                          language === 'en' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          onLanguageChange('ms');
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors ${
                          language === 'ms' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                        }`}
                      >
                        Bahasa Malaysia
                      </button>
                      <button
                        onClick={() => {
                          onLanguageChange('zh');
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors ${
                          language === 'zh' ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                        }`}
                      >
                        中文
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{t.settings.notifications}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t.settings.emailPreferences}</p>
                </div>
                <span className="text-muted-foreground text-xs">{t.settings.comingSoon}</span>
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h4 className="text-base font-bold text-foreground mb-4">{t.settings.about}</h4>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <p className="text-sm font-semibold text-foreground">{t.settings.privacyPolicy}</p>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <p className="text-sm font-semibold text-foreground">{t.settings.termsOfService}</p>
              </button>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">{t.settings.appVersion}</p>
                <p className="text-sm text-muted-foreground">1.0.0</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={onSignOut}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t.settings.logout}
          </Button>
        </div>
      </div>
    </>
  );
}
