import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, Save, ChevronDown, Loader2 } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../components/ui/toast";
import type { Restaurant } from "../../types/database.types";

interface Branch {
  id: string;
  name: string;
}

interface StaffInfo {
  id: string;
  full_name: string;
  email: string;
  branch_id: string | null;
  restaurant_id: string | null;
}

export default function StaffEdit() {
  const { user } = useAuth();
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();

  // Restaurant & branch state
  const [ownedRestaurants, setOwnedRestaurants] = useState<Restaurant[]>([]);
  const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch owned restaurants and the staff member's info
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !staffId) return;

      try {
        setLoading(true);

        // Fetch restaurants owned by this merchant
        const { data: restaurantsData, error: restError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("merchant_id", user.id)
          .eq("is_active", true)
          .order("name");

        if (restError) throw restError;

        if (restaurantsData) {
          setOwnedRestaurants(restaurantsData);
        }

        // Fetch the staff member's info (RLS policy merchant_view_restaurant_staff allows this)
        const { data: staffData, error: staffError } = await supabase
          .from("users")
          .select("id, full_name, email, branch_id, restaurant_id")
          .eq("id", staffId)
          .eq("role", "staff")
          .single();

        if (staffError) throw staffError;

        if (staffData) {
          setStaffInfo(staffData);
          setSelectedBranchId(staffData.branch_id || "");

          // Fetch branches for the staff's restaurant
          if (staffData.restaurant_id) {
            const { data: branchesData } = await supabase
              .from("branches")
              .select("id, name")
              .eq("restaurant_id", staffData.restaurant_id)
              .eq("is_active", true)
              .order("name");

            setBranches(branchesData || []);
          }
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
        showErrorToast("Failed to load staff information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, staffId]);

  // Save branch reassignment via SECURITY DEFINER function
  const handleSave = async () => {
    if (!staffInfo || !selectedBranchId || !staffInfo.restaurant_id) return;

    // No change — skip
    if (selectedBranchId === staffInfo.branch_id) {
      showSuccessToast("No changes to save");
      navigate("/merchant/staff");
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await supabase.rpc("update_staff_branch", {
        p_staff_id: staffInfo.id,
        p_restaurant_id: staffInfo.restaurant_id,
        p_new_branch_id: selectedBranchId,
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string };

      if (result.success) {
        showSuccessToast("Branch assignment updated");
        navigate("/merchant/staff");
      } else {
        showErrorToast(result.message || "Failed to update branch");
      }
    } catch (error: any) {
      console.error("Error updating staff branch:", error);
      showErrorToast(error.message || "Failed to update branch");
    } finally {
      setSaving(false);
    }
  };

  // Get the restaurant name for display
  const restaurantName = ownedRestaurants.find(
    (r) => r.id === staffInfo?.restaurant_id
  )?.name;

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/merchant/staff")}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">Edit Staff Member</h1>
            <p className="text-primary-foreground/80 text-sm">Reassign branch</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !staffInfo ? (
          <Card className="border-border/50">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground text-center">
                Staff member not found or you do not have permission to edit them.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Staff info card (read-only) */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Staff Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Name</label>
                  <p className="text-sm font-medium text-foreground">{staffInfo.full_name || "—"}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Email</label>
                  <p className="text-sm font-medium text-foreground">{staffInfo.email}</p>
                </div>
                {restaurantName && (
                  <div>
                    <label className="text-xs text-muted-foreground">Restaurant</label>
                    <p className="text-sm font-medium text-foreground">{restaurantName}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Branch reassignment */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Branch Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select the branch this staff member should be assigned to.
                </p>

                <div className="relative">
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a branch...</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {branches.length === 0 && (
                  <p className="text-xs text-amber-600">
                    No active branches found for this restaurant.
                  </p>
                )}

                {/* Save button */}
                <Button
                  onClick={handleSave}
                  disabled={!selectedBranchId || saving}
                  className="w-full"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
