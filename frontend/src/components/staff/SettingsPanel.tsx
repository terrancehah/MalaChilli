import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { getTranslation, type Language } from '../../translations';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    full_name?: string | null;
    email?: string | null;
  } | null;
  onSignOut: () => void;
  language?: Language;
}

export function SettingsPanel({ isOpen, onClose, user, onSignOut, language = 'en' }: SettingsPanelProps) {
  const t = getTranslation(language);
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl p-6 transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-1.5 bg-muted rounded-full mb-6" />
          <h2 className="text-lg font-bold text-foreground mb-2">{t.staffDashboard.settings}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {user?.full_name || user?.email}
          </p>
          <Button
            onClick={onSignOut}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
