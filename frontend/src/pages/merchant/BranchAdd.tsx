import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, Plus, ChevronDown, Loader2 } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../components/ui/toast";
import type { Restaurant } from "../../types/database.types";

// Days of the week for operating hours form
const DAYS_OF_WEEK = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export default function BranchAdd() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Restaurant selection state
  const [ownedRestaurants, setOwnedRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  // Branch form fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Operating hours — each day can be a time range string or "closed"
  const [operatingHours, setOperatingHours] = useState<Record<string, string>>({
    mon: "",
    tue: "",
    wed: "",
    thu: "",
    fri: "",
    sat: "",
    sun: "",
  });

  // Submission state
  const [saving, setSaving] = useState(false);

  // Fetch restaurants owned by this merchant
  useEffect(() => {
    const fetchOwnedRestaurants = async () => {
      if (!user) return;

      try {
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
        } else if (user.restaurant_id) {
          // Fallback: legacy restaurant_id on user record
          const { data: fallbackData } = await supabase
            .from("restaurants")
            .select("*")
            .eq("id", user.restaurant_id)
            .single();

          if (fallbackData) {
            setOwnedRestaurants([fallbackData]);
            setSelectedRestaurantId(fallbackData.id);
          }
        }
      } catch (error) {
        console.error("Error fetching owned restaurants:", error);
      }
    };

    fetchOwnedRestaurants();
  }, [user]);

  // Update a single day's operating hours
  const handleHoursChange = (day: string, value: string) => {
    setOperatingHours((prev) => ({ ...prev, [day]: value }));
  };

  // Submit new branch
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurantId) return;

    // Validation: name and address are required
    if (!name.trim() || !address.trim()) {
      showErrorToast("Branch name and address are required");
      return;
    }

    setSaving(true);

    try {
      // Build operating hours object — only include days that have values
      const hoursObj: Record<string, string> = {};
      let hasAnyHours = false;
      for (const day of DAYS_OF_WEEK) {
        const val = operatingHours[day.key]?.trim();
        if (val) {
          hoursObj[day.key] = val;
          hasAnyHours = true;
        }
      }

      // Build the insert payload
      const insertData: Record<string, any> = {
        restaurant_id: selectedRestaurantId,
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        postal_code: postalCode.trim() || null,
        operating_hours: hasAnyHours ? hoursObj : null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      };

      const { error } = await supabase.from("branches").insert(insertData);

      if (error) throw error;

      showSuccessToast(`Branch "${name.trim()}" created successfully`);
      navigate("/merchant/branches");
    } catch (error: any) {
      console.error("Error creating branch:", error);
      showErrorToast(error.message || "Failed to create branch");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/merchant/branches")}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">Add Branch</h1>
            <p className="text-primary-foreground/80 text-sm">Create a new branch location</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {/* Restaurant selector for merchants with multiple restaurants */}
        {ownedRestaurants.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Restaurant:</label>
            <div className="relative flex-1">
              <select
                value={selectedRestaurantId || ""}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
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

        {/* Basic Details */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Branch Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Branch name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g. "Main Branch", "KLCC Outlet"'
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address of the branch"
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 03-1234 5678"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {/* City, State, Postal Code — inline grid */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. KL"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Selangor"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Operating Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Enter hours like "10:00-22:00" or "closed". Leave blank to skip.
            </p>
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.key} className="flex items-center gap-3">
                <label className="text-sm text-foreground w-24 flex-shrink-0">{day.label}</label>
                <input
                  type="text"
                  value={operatingHours[day.key]}
                  onChange={(e) => handleHoursChange(day.key, e.target.value)}
                  placeholder="e.g. 10:00-22:00"
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Geolocation (optional) */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Location Coordinates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Optional. Used for map integration and distance sorting.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 3.1390"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 101.6869"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit button */}
        <Button type="submit" disabled={saving || !name.trim() || !address.trim()} className="w-full">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Create Branch
        </Button>
      </form>
    </div>
  );
}
