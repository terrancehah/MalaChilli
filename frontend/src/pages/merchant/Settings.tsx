import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  ArrowLeft,
  Save,
  Building2,
  Percent,
  Clock,
  DollarSign,
  ChevronDown,
  Globe,
  Utensils,
  Share2,
} from "lucide-react";

interface RestaurantSettings {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  guaranteed_discount_percent: number;
  upline_reward_percent: number;
  max_redemption_percent: number;
  virtual_currency_expiry_days: number;
  // Contact & Identity
  email: string | null;
  website_url: string | null;
  registration_number: string | null;
  // Cuisine & Discovery
  cuisine_type: string[] | null;
  price_range: number | null;
  halal_certified: boolean;
  // Visual Branding
  cover_image_url: string | null;
  // Social & Online Presence
  social_media: { facebook?: string; instagram?: string; tiktok?: string; google_maps_url?: string } | null;
}

// Common Malaysian cuisine types for quick-add tags
const CUISINE_OPTIONS = [
  "Malay",
  "Chinese",
  "Indian",
  "Japanese",
  "Korean",
  "Thai",
  "Western",
  "Fusion",
  "Mamak",
  "Kopitiam",
  "Seafood",
  "Steamboat",
  "BBQ",
  "Nasi Kandar",
  "Dim Sum",
  "Cafe",
  "Bakery",
  "Vegetarian",
  "Halal",
];

export default function RestaurantSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ownedRestaurants, setOwnedRestaurants] = useState<RestaurantSettings[]>([]); // All restaurants owned by merchant
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch restaurants owned by this merchant via merchant_id
  useEffect(() => {
    const fetchOwnedRestaurants = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Query restaurants where this merchant is the owner
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .eq("merchant_id", user.id)
          .eq("is_active", true)
          .order("name");

        if (error) throw error;

        if (data && data.length > 0) {
          setOwnedRestaurants(data);
          setSelectedRestaurantId(data[0].id);
          setSettings(data[0]);
        } else if (user.restaurant_id) {
          // Fallback: legacy restaurant_id on user record
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("restaurants")
            .select("*")
            .eq("id", user.restaurant_id)
            .single();

          if (fallbackError) throw fallbackError;

          if (fallbackData) {
            setOwnedRestaurants([fallbackData]);
            setSelectedRestaurantId(fallbackData.id);
            setSettings(fallbackData);
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedRestaurants();
  }, [user]);

  // Handle switching between owned restaurants
  const handleRestaurantSwitch = (newRestaurantId: string) => {
    const selected = ownedRestaurants.find((r) => r.id === newRestaurantId);
    if (selected) {
      setSelectedRestaurantId(selected.id);
      setSettings(selected);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);

      // Build social_media JSONB — only include non-empty values
      const socialMedia: Record<string, string> = {};
      if (settings.social_media?.facebook) socialMedia.facebook = settings.social_media.facebook;
      if (settings.social_media?.instagram) socialMedia.instagram = settings.social_media.instagram;
      if (settings.social_media?.tiktok) socialMedia.tiktok = settings.social_media.tiktok;
      if (settings.social_media?.google_maps_url) socialMedia.google_maps_url = settings.social_media.google_maps_url;

      const { error } = await supabase
        .from("restaurants")
        .update({
          name: settings.name,
          description: settings.description,
          // Contact & Identity
          email: settings.email || null,
          website_url: settings.website_url || null,
          // Cuisine & Discovery
          cuisine_type: settings.cuisine_type && settings.cuisine_type.length > 0 ? settings.cuisine_type : null,
          price_range: settings.price_range || null,
          halal_certified: settings.halal_certified,
          // Visual Branding
          cover_image_url: settings.cover_image_url || null,
          // Social & Online Presence
          social_media: Object.keys(socialMedia).length > 0 ? socialMedia : null,
          // Reward mechanics
          guaranteed_discount_percent: settings.guaranteed_discount_percent,
          upline_reward_percent: settings.upline_reward_percent,
          max_redemption_percent: settings.max_redemption_percent,
          virtual_currency_expiry_days: settings.virtual_currency_expiry_days,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id);

      if (error) throw error;

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/merchant/dashboard")}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">Restaurant Settings</h1>
            <p className="text-primary-foreground/80 text-sm">Configure your restaurant preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {/* Restaurant selector for merchants with multiple restaurants */}
        {ownedRestaurants.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Restaurant:</label>
            <div className="relative flex-1">
              <select
                value={selectedRestaurantId || ""}
                onChange={(e) => handleRestaurantSwitch(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-sm font-medium rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {ownedRestaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}

        {/* Basic Information */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                placeholder="Enter restaurant name"
              />
            </div>

            <div>
              <Label htmlFor="slug">URL Slug (Read-only)</Label>
              <Input id="slug" value={settings.slug} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">Used in referral links: /join/{settings.slug}/CODE</p>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                value={settings.description || ""}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                placeholder="Brief description of your restaurant"
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Contact & Online
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Business Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email || ""}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="info@restaurant.com"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={settings.website_url || ""}
                  onChange={(e) => setSettings({ ...settings, website_url: e.target.value })}
                  placeholder="https://restaurant.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cuisine & Discovery */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Cuisine & Discovery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cuisine tags — clickable pills */}
            <div>
              <Label>Cuisine Tags</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {CUISINE_OPTIONS.map((cuisine) => {
                  const isSelected =
                    settings.cuisine_type?.map((c) => c.toLowerCase()).includes(cuisine.toLowerCase()) ?? false;
                  return (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => {
                        const current = settings.cuisine_type || [];
                        const updated = isSelected
                          ? current.filter((c) => c.toLowerCase() !== cuisine.toLowerCase())
                          : [...current, cuisine];
                        setSettings({ ...settings, cuisine_type: updated });
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {cuisine}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price range */}
              <div>
                <Label htmlFor="price-range">Price Range</Label>
                <select
                  id="price-range"
                  value={settings.price_range?.toString() || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, price_range: e.target.value ? parseInt(e.target.value) : null })
                  }
                  className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Not set</option>
                  <option value="1">$ — Budget (&lt; RM15)</option>
                  <option value="2">$$ — Moderate (RM15–40)</option>
                  <option value="3">$$$ — Premium (RM40+)</option>
                </select>
              </div>

              {/* Halal certified */}
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.halal_certified ?? false}
                    onChange={(e) => setSettings({ ...settings, halal_certified: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Halal Certified</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cover-image">Cover Image URL</Label>
              <Input
                id="cover-image"
                value={settings.cover_image_url || ""}
                onChange={(e) => setSettings({ ...settings, cover_image_url: e.target.value })}
                placeholder="https://images.example.com/cover.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">Banner image for your restaurant profile page</p>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="social-facebook">Facebook</Label>
                <Input
                  id="social-facebook"
                  value={settings.social_media?.facebook || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, social_media: { ...settings.social_media, facebook: e.target.value } })
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label htmlFor="social-instagram">Instagram</Label>
                <Input
                  id="social-instagram"
                  value={settings.social_media?.instagram || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, social_media: { ...settings.social_media, instagram: e.target.value } })
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <Label htmlFor="social-tiktok">TikTok</Label>
                <Input
                  id="social-tiktok"
                  value={settings.social_media?.tiktok || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, social_media: { ...settings.social_media, tiktok: e.target.value } })
                  }
                  placeholder="https://tiktok.com/@..."
                />
              </div>
              <div>
                <Label htmlFor="social-google-maps">Google Maps</Label>
                <Input
                  id="social-google-maps"
                  value={settings.social_media?.google_maps_url || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_media: { ...settings.social_media, google_maps_url: e.target.value },
                    })
                  }
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discount & Rewards Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Discount & Rewards Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="guaranteed_discount">Guaranteed First-Time Discount (%)</Label>
              <Input
                id="guaranteed_discount"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.guaranteed_discount_percent}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    guaranteed_discount_percent: parseFloat(e.target.value),
                  })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">Discount given to first-time customers (default: 5%)</p>
            </div>

            <div>
              <Label htmlFor="upline_reward">Upline Reward Percentage (%)</Label>
              <Input
                id="upline_reward"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.upline_reward_percent}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    upline_reward_percent: parseFloat(e.target.value),
                  })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Percentage given to each upline (Level 1, 2, 3) per transaction (default: 1%)
              </p>
            </div>

            <div>
              <Label htmlFor="max_redemption">Maximum VC Redemption (%)</Label>
              <Input
                id="max_redemption"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.max_redemption_percent}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    max_redemption_percent: parseFloat(e.target.value),
                  })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum % of bill that can be paid with Virtual Currency (default: 20%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Virtual Currency Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Virtual Currency Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="expiry_days">VC Expiry Period (Days)</Label>
              <Input
                id="expiry_days"
                type="number"
                min="1"
                value={settings.virtual_currency_expiry_days}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    virtual_currency_expiry_days: parseInt(e.target.value),
                  })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Number of days before earned Virtual Currency expires (default: 30 days)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>

        {/* Info Card */}
        <Card className="border-border/50 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Changes to discount percentages apply to new transactions only</li>
                  <li>Existing Virtual Currency balances are not affected by expiry changes</li>
                  <li>URL slug cannot be changed after creation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
