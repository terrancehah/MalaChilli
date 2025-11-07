import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { X, Edit2, Save, LogOut } from 'lucide-react';
import { getTranslation, type Language } from '../../translations';
import { supabase } from '../../lib/supabase';

interface OwnerSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    full_name?: string | null;
    email?: string | null;
    created_at?: string;
  } | null;
  onSignOut: () => void;
  restaurantName?: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function OwnerSettingsPanel({ 
  isOpen, 
  onClose, 
  user, 
  onSignOut,
  restaurantName,
  language,
  onLanguageChange
}: OwnerSettingsPanelProps) {
  const t = getTranslation(language);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const languageLabels = {
    en: 'English',
    ms: 'Bahasa Malaysia',
    zh: '中文'
  };

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleEditName = () => {
    setEditedName(user?.full_name || '');
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setMessage({ type: 'error', text: t.settings.nameEmpty });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (editedName === user?.full_name) {
      setIsEditingName(false);
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ full_name: editedName })
        .eq('id', user!.id);

      if (error) throw error;

      setMessage({ type: 'success', text: t.settings.nameUpdated });
      setIsEditingName(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: t.settings.nameUpdateFailed });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      onClose();
      setIsClosing(false);
      setIsEditingName(false);
      setEditedName('');
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
            <h3 className="text-xl font-bold text-foreground leading-none pt-2">{t.settings.title}</h3>
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 h-6 w-6 p-0 hover:bg-muted rounded-md transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Section */}
          <div className="mb-6">
            <h4 className="text-base font-bold text-foreground mb-4">{t.settings.profile}</h4>
            
            {/* Success/Error Message */}
            {message && (
              <div className={`mb-3 p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-3">
              {/* Name Field */}
              <div className={`bg-muted/50 rounded-lg transition-all duration-300 ease-in-out ${
                isEditingName ? 'ring-2 ring-primary/20' : ''
              }`}>
                <div className="p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground mb-2">{t.settings.name}</p>
                    
                    {!isEditingName && (
                      <p className="text-sm text-muted-foreground">{user?.full_name || t.settings.notSet}</p>
                    )}
                    
                    {/* Input and Buttons */}
                    <div className="grid transition-[grid-template-rows] duration-300 ease-in-out" style={{
                      gridTemplateRows: isEditingName ? '1fr' : '0fr'
                    }}>
                      <div className="overflow-hidden">
                        <div className="space-y-3 pt-1 px-0.5">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                            placeholder={t.settings.enterName}
                            disabled={isSaving}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSaveName}
                              disabled={isSaving}
                              className="flex-1 h-9 text-sm px-4 py-2 font-medium"
                            >
                              {isSaving ? (
                                t.settings.saving
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-1.5" />
                                  {t.settings.save}
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                              className="flex-1 h-9 text-sm px-4 py-2 font-medium"
                            >
                              {t.settings.cancel}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit Button */}
                  {!isEditingName && (
                    <button
                      onClick={handleEditName}
                      className="text-primary hover:text-primary/80 transition-colors flex-shrink-0 ml-3"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">{t.settings.email}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              {/* Restaurant Name */}
              {restaurantName && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-semibold text-foreground mb-2">{t.settings.restaurant}</p>
                  <p className="text-sm text-muted-foreground">{restaurantName}</p>
                </div>
              )}

              {/* Member Since */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">{t.settings.memberSince}</p>
                <p className="text-sm text-muted-foreground">{memberSince}</p>
              </div>
            </div>
          </div>

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
                {showLanguageMenu && (
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
