import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, Save, Building2, Percent, Clock, DollarSign } from 'lucide-react';

interface RestaurantSettings {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  guaranteed_discount_percent: number;
  upline_reward_percent: number;
  max_redemption_percent: number;
  virtual_currency_expiry_days: number;
}

export default function RestaurantSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.restaurant_id) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', user.restaurant_id)
          .single();

        if (error) throw error;

        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('restaurants')
        .update({
          name: settings.name,
          description: settings.description,
          guaranteed_discount_percent: settings.guaranteed_discount_percent,
          upline_reward_percent: settings.upline_reward_percent,
          max_redemption_percent: settings.max_redemption_percent,
          virtual_currency_expiry_days: settings.virtual_currency_expiry_days,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id);

      if (error) throw error;

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
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
            onClick={() => navigate('/owner/dashboard')}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">
              Restaurant Settings
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              Configure your restaurant preferences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
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
              <Input
                id="slug"
                value={settings.slug}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used in referral links: /join/{settings.slug}/CODE
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                value={settings.description || ''}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                placeholder="Brief description of your restaurant"
                className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm"
              />
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
                onChange={(e) => setSettings({ 
                  ...settings, 
                  guaranteed_discount_percent: parseFloat(e.target.value) 
                })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Discount given to first-time customers (default: 5%)
              </p>
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
                onChange={(e) => setSettings({ 
                  ...settings, 
                  upline_reward_percent: parseFloat(e.target.value) 
                })}
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
                onChange={(e) => setSettings({ 
                  ...settings, 
                  max_redemption_percent: parseFloat(e.target.value) 
                })}
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
                onChange={(e) => setSettings({ 
                  ...settings, 
                  virtual_currency_expiry_days: parseInt(e.target.value) 
                })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Number of days before earned Virtual Currency expires (default: 30 days)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
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
