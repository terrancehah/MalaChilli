import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, UserPlus, Edit, Trash2, Users, ChevronDown } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../components/ui/toast";
import type { Restaurant } from "../../types/database.types";

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  branch_id: string | null;
  branch_name?: string;
  created_at: string;
}

interface Branch {
  id: string;
  name: string;
}

export default function StaffManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ownedRestaurants, setOwnedRestaurants] = useState<Restaurant[]>([]); // All restaurants owned by merchant
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null); // Track which staff is being removed

  // Fetch restaurants owned by this merchant via merchant_id
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

  // Fetch staff and branches for the selected restaurant
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedRestaurantId) return;

      try {
        setLoading(true);

        // Fetch branches for the selected restaurant
        const { data: branchesData } = await supabase
          .from("branches")
          .select("id, name")
          .eq("restaurant_id", selectedRestaurantId)
          .eq("is_active", true);

        if (branchesData) {
          setBranches(branchesData);
        }

        // Fetch staff members assigned to the selected restaurant
        // (merchant_view_restaurant_staff RLS policy allows this)
        const { data: staffData } = await supabase
          .from("users")
          .select("id, full_name, email, branch_id, created_at")
          .eq("restaurant_id", selectedRestaurantId)
          .eq("role", "staff")
          .order("created_at", { ascending: false });

        if (staffData) {
          // Map branch names to staff
          const staffWithBranches = staffData.map((s) => ({
            ...s,
            branch_name: branchesData?.find((b) => b.id === s.branch_id)?.name || "Unassigned",
          }));
          setStaff(staffWithBranches);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRestaurantId]);

  // Remove staff via SECURITY DEFINER function (reverts them to customer)
  const handleRemoveStaff = async (staffId: string) => {
    if (!confirm("Are you sure you want to remove this staff member? They will be reverted to a customer.")) return;
    if (!selectedRestaurantId) return;

    setRemovingId(staffId);

    try {
      const { data, error } = await supabase.rpc("remove_staff_from_restaurant", {
        p_staff_id: staffId,
        p_restaurant_id: selectedRestaurantId,
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string; user_name?: string };

      if (result.success) {
        showSuccessToast(`${result.user_name || "Staff member"} has been removed`);
        // Remove from local state
        setStaff(staff.filter((s) => s.id !== staffId));
      } else {
        showErrorToast(result.message || "Failed to remove staff");
      }
    } catch (error: any) {
      console.error("Error removing staff:", error);
      showErrorToast(error.message || "Failed to remove staff member");
    } finally {
      setRemovingId(null);
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
            onClick={() => navigate("/merchant/dashboard")}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">Manage Staff</h1>
            <p className="text-primary-foreground/80 text-sm">Add and manage staff accounts</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
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

        {/* Stats */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-bold text-foreground">{staff.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Staff Button */}
        <Button onClick={() => navigate("/merchant/staff/add")} className="w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Staff Member
        </Button>

        {/* Staff List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
            ) : staff.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No staff members yet. Click "Add New Staff Member" to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {staff.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{member.full_name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">Branch: {member.branch_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Edit button — navigate to branch reassignment page */}
                      <Button variant="outline" size="sm" onClick={() => navigate(`/merchant/staff/edit/${member.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {/* Remove button — reverts staff to customer via DB function */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveStaff(member.id)}
                        disabled={removingId === member.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
