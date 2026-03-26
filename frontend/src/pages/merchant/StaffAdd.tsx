import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, Search, UserPlus, AlertCircle, CheckCircle2, ArrowRightLeft, ChevronDown, Loader2 } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../components/ui/toast";
import type { Restaurant } from "../../types/database.types";

interface Branch {
  id: string;
  name: string;
}

// Shape returned by the merchant_lookup_user_by_email DB function
interface LookupResult {
  found: boolean;
  eligible?: boolean;
  error?: string;
  user_id?: string;
  full_name?: string;
  email?: string;
  current_role?: string;
  current_restaurant_id?: string;
  is_transfer?: boolean;
}

export default function StaffAdd() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Restaurant & branch state
  const [ownedRestaurants, setOwnedRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  // Email lookup state
  const [email, setEmail] = useState("");
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  // Assignment state
  const [assigning, setAssigning] = useState(false);

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

  // Fetch branches when restaurant changes
  useEffect(() => {
    const fetchBranches = async () => {
      if (!selectedRestaurantId) return;

      try {
        const { data } = await supabase
          .from("branches")
          .select("id, name")
          .eq("restaurant_id", selectedRestaurantId)
          .eq("is_active", true)
          .order("name");

        setBranches(data || []);
        setSelectedBranchId(""); // Reset branch selection
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
    // Reset lookup when restaurant changes
    setLookupResult(null);
  }, [selectedRestaurantId]);

  // Look up user by email via SECURITY DEFINER function
  const handleLookup = async () => {
    if (!email.trim() || !selectedRestaurantId) return;

    setLookupLoading(true);
    setLookupResult(null);

    try {
      const { data, error } = await supabase.rpc("merchant_lookup_user_by_email", {
        p_email: email.trim(),
        p_restaurant_id: selectedRestaurantId,
      });

      if (error) throw error;

      setLookupResult(data as LookupResult);
    } catch (error: any) {
      console.error("Error looking up user:", error);
      showErrorToast(error.message || "Failed to look up user");
    } finally {
      setLookupLoading(false);
    }
  };

  // Assign the looked-up user as staff
  const handleAssign = async () => {
    if (!lookupResult?.eligible || !selectedRestaurantId || !selectedBranchId) return;

    setAssigning(true);

    try {
      const { data, error } = await supabase.rpc("assign_staff_to_restaurant", {
        p_user_email: email.trim(),
        p_restaurant_id: selectedRestaurantId,
        p_branch_id: selectedBranchId,
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string; user_name?: string; action?: string };

      if (result.success) {
        const actionLabel = result.action === "transferred" ? "transferred" : "added";
        showSuccessToast(`${result.user_name || "User"} has been ${actionLabel} as staff`);
        navigate("/merchant/staff");
      } else {
        showErrorToast(result.message || "Failed to assign staff");
      }
    } catch (error: any) {
      console.error("Error assigning staff:", error);
      showErrorToast(error.message || "Failed to assign staff");
    } finally {
      setAssigning(false);
    }
  };

  // Allow pressing Enter in the email field to trigger lookup
  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLookup();
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
            onClick={() => navigate("/merchant/staff")}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">Add Staff Member</h1>
            <p className="text-primary-foreground/80 text-sm">Search for an existing user by email</p>
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

        {/* Step 1: Email Lookup */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Step 1: Find User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the email address of the user you want to add as staff. They must already have a MakanTak account.
            </p>

            {/* Email input + search button */}
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLookupResult(null); // Reset result when email changes
                }}
                onKeyDown={handleEmailKeyDown}
                placeholder="staff@example.com"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <Button
                onClick={handleLookup}
                disabled={!email.trim() || lookupLoading}
                variant="outline"
              >
                {lookupLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Lookup result display */}
            {lookupResult && (
              <div
                className={`rounded-lg p-4 border ${
                  lookupResult.found && lookupResult.eligible
                    ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                }`}
              >
                {/* User not found */}
                {!lookupResult.found && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">User not found</p>
                      <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                        {lookupResult.error || "No account exists with this email. The user must register first."}
                      </p>
                    </div>
                  </div>
                )}

                {/* User found but not eligible */}
                {lookupResult.found && !lookupResult.eligible && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">Not eligible</p>
                      <p className="text-xs text-red-600 dark:text-red-500 mt-1">{lookupResult.error}</p>
                    </div>
                  </div>
                )}

                {/* User found and eligible */}
                {lookupResult.found && lookupResult.eligible && (
                  <div className="flex items-start gap-3">
                    {lookupResult.is_transfer ? (
                      <ArrowRightLeft className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        {lookupResult.full_name || "User"} found
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{lookupResult.email}</p>

                      {/* Transfer warning */}
                      {lookupResult.is_transfer && (
                        <div className="mt-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-md p-2">
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            This user is currently staff at another restaurant. Assigning them here will transfer them away from their current restaurant.
                          </p>
                        </div>
                      )}

                      {/* Current role badge */}
                      {lookupResult.current_role === "customer" && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                          Currently a customer — will be promoted to staff
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Branch Selection — only shown when user is found and eligible */}
        {lookupResult?.found && lookupResult?.eligible && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Step 2: Assign Branch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select which branch this staff member should be assigned to.
              </p>

              {/* Branch selector */}
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
                  No active branches found. Please add a branch first.
                </p>
              )}

              {/* Confirm assignment button */}
              <Button
                onClick={handleAssign}
                disabled={!selectedBranchId || assigning}
                className="w-full"
              >
                {assigning ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                {lookupResult.is_transfer ? "Transfer & Assign as Staff" : "Add as Staff"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
