import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../components/ui/toast";

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

export default function BranchEdit() {
  const { user } = useAuth();
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();

  // Branch form fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Operating hours state
  const [operatingHours, setOperatingHours] = useState<Record<string, string>>({
    mon: "",
    tue: "",
    wed: "",
    thu: "",
    fri: "",
    sat: "",
    sun: "",
  });

  // Loading and saving state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing branch data
  useEffect(() => {
    const fetchBranch = async () => {
      if (!user || !branchId) return;

      try {
        setLoading(true);

        // The merchant_manage_restaurant_branches RLS policy allows this SELECT
        const { data, error } = await supabase
          .from("branches")
          .select("*")
          .eq("id", branchId)
          .single();

        if (error) throw error;

        if (data) {
          setName(data.name || "");
          setAddress(data.address || "");
          setPhone(data.phone || "");
          setCity(data.city || "");
          setState(data.state || "");
          setPostalCode(data.postal_code || "");
          setLatitude(data.latitude != null ? String(data.latitude) : "");
          setLongitude(data.longitude != null ? String(data.longitude) : "");

          // Populate operating hours from JSONB
          if (data.operating_hours && typeof data.operating_hours === "object") {
            const hours: Record<string, string> = { mon: "", tue: "", wed: "", thu: "", fri: "", sat: "", sun: "" };
            for (const day of DAYS_OF_WEEK) {
              hours[day.key] = (data.operating_hours as Record<string, string>)[day.key] || "";
            }
            setOperatingHours(hours);
          }
        }
      } catch (error) {
        console.error("Error fetching branch:", error);
        showErrorToast("Failed to load branch details");
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [user, branchId]);

  // Update a single day's operating hours
  const handleHoursChange = (day: string, value: string) => {
    setOperatingHours((prev) => ({ ...prev, [day]: value }));
  };

  // Save branch updates
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchId) return;

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

      // Build the update payload
      const updateData: Record<string, any> = {
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        postal_code: postalCode.trim() || null,
        operating_hours: hasAnyHours ? hoursObj : null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        updated_at: new Date().toISOString(),
      };

      // merchant_manage_restaurant_branches RLS policy allows UPDATE
      const { error } = await supabase
        .from("branches")
        .update(updateData)
        .eq("id", branchId);

      if (error) throw error;

      showSuccessToast("Branch updated successfully");
      navigate("/merchant/branches");
    } catch (error: any) {
      console.error("Error updating branch:", error);
      showErrorToast(error.message || "Failed to update branch");
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
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">Edit Branch</h1>
            <p className="text-primary-foreground/80 text-sm">Update branch details</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
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

          {/* Save button */}
          <Button type="submit" disabled={saving || !name.trim() || !address.trim()} className="w-full">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </form>
      )}
    </div>
  );
}
