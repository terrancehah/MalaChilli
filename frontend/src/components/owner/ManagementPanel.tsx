import { Users, Building2, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTranslation, type Language } from '../../translations';

interface ManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName?: string;
  language: Language;
}

export function ManagementPanel({ 
  isOpen, 
  onClose, 
  restaurantName,
  language
}: ManagementPanelProps) {
  const navigate = useNavigate();
  const t = getTranslation(language);

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: Users,
      label: t.ownerDashboard.management.manageStaff,
      description: t.ownerDashboard.management.manageStaffDesc,
      onClick: () => {
        onClose();
        navigate('/owner/staff');
      }
    },
    {
      icon: Building2,
      label: t.ownerDashboard.management.manageBranches,
      description: t.ownerDashboard.management.manageBranchesDesc,
      onClick: () => {
        onClose();
        navigate('/owner/branches');
      }
    },
    {
      icon: SettingsIcon,
      label: t.ownerDashboard.management.restaurantSettings,
      description: t.ownerDashboard.management.restaurantSettingsDesc,
      onClick: () => {
        onClose();
        navigate('/owner/settings');
      }
    }
  ];

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">{t.ownerDashboard.management.title}</h2>
          {restaurantName && (
            <p className="text-sm text-muted-foreground mt-1">
              {restaurantName}
            </p>
          )}
        </div>

        {/* Menu Items */}
        <div className="px-6 py-4 space-y-2 pb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
