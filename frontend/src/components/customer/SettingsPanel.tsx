import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { X, Edit2, Save, LogOut } from 'lucide-react';

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
  onSignOut: () => void;
}

export function SettingsPanel({ isOpen, onClose, user, onSaveName, onSignOut }: SettingsPanelProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleEditName = () => {
    setEditedName(user.full_name || '');
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
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
      setMessage({ type: 'success', text: 'Name updated successfully!' });
      setIsEditingName(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update name. Please try again.' });
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
            <h3 className="text-xl font-bold text-foreground leading-none pt-2">Settings</h3>
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
            <h4 className="text-base font-bold text-foreground mb-4">Profile</h4>
            
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
                    <p className="text-sm font-semibold text-foreground mb-2">Name</p>
                    
                    {!isEditingName && (
                      <p className="text-sm text-muted-foreground">{user.full_name || 'Not set'}</p>
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
                            placeholder="Enter your name"
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
                                'Saving...'
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-1.5" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                              className="flex-1 h-9 text-sm px-4 py-2 font-medium"
                            >
                              Cancel
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
                <p className="text-sm font-semibold text-foreground mb-2">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Member Since */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">Member Since</p>
                <p className="text-sm text-muted-foreground">{memberSince}</p>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="mb-6">
            <h4 className="text-base font-bold text-foreground mb-4">Preferences</h4>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Language</p>
                  <p className="text-sm text-muted-foreground mt-0.5">English</p>
                </div>
                <span className="text-muted-foreground text-xs">Coming soon</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">Notifications</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Email preferences</p>
                </div>
                <span className="text-muted-foreground text-xs">Coming soon</span>
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h4 className="text-base font-bold text-foreground mb-4">About</h4>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <p className="text-sm font-semibold text-foreground">Privacy Policy</p>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <p className="text-sm font-semibold text-foreground">Terms of Service</p>
              </button>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">App Version</p>
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
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
