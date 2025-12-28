import { useState, useEffect } from "react";
import { Building2, MapPin } from "lucide-react";
import { getTranslation, type Language } from "../../translations";
import { supabase } from "../../lib/supabase";
import { BaseSettingsPanel } from "../shared";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    full_name: string | null;
    email: string;
    restaurant_id: string | null;
    branch_id: string | null;
    created_at: string;
  };
  onSignOut: () => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function SettingsPanel({
  isOpen,
  onClose,
  user,
  onSignOut,
  language = "en",
  onLanguageChange,
}: SettingsPanelProps) {
  const t = getTranslation(language);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string | null>(null);

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  // Fetch restaurant and branch names
  useEffect(() => {
    if (isOpen && user.restaurant_id) {
      fetchLocationInfo();
    }
  }, [isOpen, user.restaurant_id, user.branch_id]);

  const fetchLocationInfo = async () => {
    if (!user.restaurant_id) return;

    try {
      // Fetch restaurant name
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("name")
        .eq("id", user.restaurant_id)
        .single();

      if (restaurant) {
        setRestaurantName(restaurant.name);
      }

      // Fetch branch name if available
      if (user.branch_id) {
        const { data: branch } = await supabase
          .from("branches")
          .select("name")
          .eq("id", user.branch_id)
          .single();

        if (branch) {
          setBranchName(branch.name);
        }
      }
    } catch (err) {
      console.error("Failed to fetch location info:", err);
    }
  };

  return (
    <BaseSettingsPanel
      isOpen={isOpen}
      onClose={onClose}
      title={t.staffDashboard.settings}
      onSignOut={onSignOut}
      language={language}
      onLanguageChange={onLanguageChange}
    >
      {/* Profile Section */}
      <div className="mb-6">
        <h4 className="text-base font-bold text-foreground mb-4">
          {t.settings.profile}
        </h4>
        <div className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold text-foreground mb-2">
              {t.settings.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {user.full_name || t.settings.notSet}
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold text-foreground mb-2">
              {t.settings.email}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold text-foreground mb-2">
              {t.settings.memberSince}
            </p>
            <p className="text-sm text-muted-foreground">{memberSince}</p>
          </div>
        </div>
      </div>

      {/* Location Info Section */}
      {(restaurantName || branchName) && (
        <div className="mb-6">
          <h4 className="text-base font-bold text-foreground mb-4">Location</h4>
          <div className="space-y-3">
            {restaurantName && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    Restaurant
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {restaurantName}
                </p>
              </div>
            )}
            {branchName && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    Branch
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{branchName}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </BaseSettingsPanel>
  );
}
