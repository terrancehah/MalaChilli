import { useState } from 'react';
import { Button } from '../ui/button';
import { Edit2, Save, AlertTriangle } from 'lucide-react';
import { getTranslation, type Language } from '../../translations';
import { BaseSettingsPanel } from '../shared';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    full_name: string | null;
    email: string;
    created_at: string;
  };
  onSaveName: (name: string) => Promise<void>;
  onDeleteAccount?: (userId: string) => Promise<void>;
  onSignOut: () => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function SettingsPanel({ 
  isOpen, 
  onClose, 
  user, 
  onSaveName, 
  onDeleteAccount,
  onSignOut, 
  language = 'en', 
  onLanguageChange 
}: SettingsPanelProps) {
  const t = getTranslation(language);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const handleEditName = () => {
    setEditedName(user.full_name || '');
    setIsEditingName(true);
  };

  const handleDeleteAccount = async () => {
    if (!onDeleteAccount) return;
    
    setIsDeleting(true);
    try {
      await onDeleteAccount(user.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete account:', error);
      setMessage({ type: 'error', text: t.settings.deleteFailed || 'Failed to delete account' });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setMessage({ type: 'error', text: t.settings.nameEmpty });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (editedName === user.full_name) {
      setIsEditingName(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSaveName(editedName);
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

  return (
    <BaseSettingsPanel
      isOpen={isOpen}
      onClose={onClose}
      title={t.settings.title}
      onSignOut={onSignOut}
      language={language}
      onLanguageChange={onLanguageChange}
    >

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
                      <p className="text-sm text-muted-foreground">{user.full_name || t.settings.notSet}</p>
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
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Member Since */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">{t.settings.memberSince}</p>
                <p className="text-sm text-muted-foreground">{memberSince}</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          {onDeleteAccount && (
            <div className="mt-8 pt-6 border-t border-border">
              {!showDeleteConfirm ? (
                <Button
                  variant="destructive"
                  className="w-full flex items-center gap-2 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 shadow-none"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <AlertTriangle className="h-4 w-4" />
                  {t.settings.deleteAccount}
                </Button>
              ) : (
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-destructive/10 rounded-full shrink-0">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <h4 className="font-bold text-destructive text-sm">{t.settings.deleteConfirmTitle}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {t.settings.deleteConfirmDesc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-9 text-xs"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                    >
                      {t.settings.cancel}
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 h-9 text-xs"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? t.settings.saving : t.settings.confirmDelete}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

    </BaseSettingsPanel>
  );
}
