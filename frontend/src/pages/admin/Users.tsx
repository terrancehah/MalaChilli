import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowLeft, Search, Edit, ChevronUp, ChevronDown, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../components/ui/toast";

// Extended user interface with restaurant and branch info
interface User {
  id: string;
  email: string;
  full_name: string;
  role: "customer" | "staff" | "merchant" | "admin";
  branch_id: string | null;
  restaurant_id: string | null;
  created_at: string;
  last_login: string;
  // Joined data from related tables (for staff - single restaurant/branch)
  restaurant?: { id: string; name: string } | null;
  branch?: { id: string; name: string; restaurant_id: string } | null;
  // For merchants - multiple restaurants they own (via merchant_id on restaurants table)
  owned_restaurants?: { id: string; name: string }[];
}

// Restaurant and branch for dropdowns
interface Restaurant {
  id: string;
  name: string;
  merchant_id: string | null;
}

interface Branch {
  id: string;
  name: string;
  restaurant_id: string;
}

// Sort configuration type
type SortField = "full_name" | "role" | "created_at" | "last_login";
type SortOrder = "asc" | "desc";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Role filter state
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  // Restaurant and branch data for role change modal
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  // Role change modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleChangeUser, setRoleChangeUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [roleChangeLoading, setRoleChangeLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRestaurantsAndBranches();
  }, []);

  // Fetch users with restaurant and branch info
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Use explicit FK relationship to avoid ambiguity with customer_restaurant_history
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select(
          `
          *,
          restaurant:restaurants!users_restaurant_id_fkey(id, name),
          branch:branches!users_branch_id_fkey(id, name, restaurant_id)
        `
        )
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;

      // Fetch restaurants with merchant_id to map owned restaurants to merchants
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from("restaurants")
        .select("id, name, merchant_id")
        .eq("is_active", true);

      if (restaurantsError) throw restaurantsError;

      // Map owned restaurants to merchant users
      const usersWithOwnedRestaurants = (usersData || []).map((user) => {
        if (user.role === "merchant") {
          // Find all restaurants where this user is the merchant
          const ownedRestaurants = (restaurantsData || [])
            .filter((r) => r.merchant_id === user.id)
            .map((r) => ({ id: r.id, name: r.name }));
          return { ...user, owned_restaurants: ownedRestaurants };
        }
        return user;
      });

      setUsers(usersWithOwnedRestaurants);
    } catch (error) {
      console.error("Error fetching users:", error);
      showErrorToast("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch restaurants and branches for role change modal
  const fetchRestaurantsAndBranches = async () => {
    try {
      const [restaurantsRes, branchesRes] = await Promise.all([
        supabase.from("restaurants").select("id, name, merchant_id").eq("is_active", true).order("name"),
        supabase.from("branches").select("id, name, restaurant_id").eq("is_active", true).order("name"),
      ]);

      if (restaurantsRes.error) throw restaurantsRes.error;
      if (branchesRes.error) throw branchesRes.error;

      setRestaurants(restaurantsRes.data || []);
      setBranches(branchesRes.data || []);
    } catch (error) {
      console.error("Error fetching restaurants/branches:", error);
    }
  };

  // Handle role update with validation for staff/merchant
  const handleRoleUpdate = async () => {
    if (!roleChangeUser || !newRole) return;

    // Validate required fields for staff and merchant roles
    if (newRole === "staff" && (!selectedRestaurantId || !selectedBranchId)) {
      showErrorToast("Staff role requires both restaurant and branch assignment");
      return;
    }

    if (newRole === "merchant" && !selectedRestaurantId) {
      showErrorToast("Merchant role requires at least one restaurant assignment");
      return;
    }

    setRoleChangeLoading(true);

    try {
      // Build update object based on new role
      const updateData: Record<string, any> = { role: newRole };

      if (newRole === "staff") {
        updateData.restaurant_id = selectedRestaurantId;
        updateData.branch_id = selectedBranchId;
      } else {
        // Customer, admin, or merchant - clear restaurant/branch assignments on user
        // Merchants are linked via restaurant.merchant_id, not user.restaurant_id
        updateData.restaurant_id = null;
        updateData.branch_id = null;
      }

      // Update user role
      const { error: userError } = await supabase.from("users").update(updateData).eq("id", roleChangeUser.id);

      if (userError) throw userError;

      // For merchant role, also update the restaurant's merchant_id
      if (newRole === "merchant" && selectedRestaurantId) {
        const { error: restaurantError } = await supabase
          .from("restaurants")
          .update({ merchant_id: roleChangeUser.id })
          .eq("id", selectedRestaurantId);

        if (restaurantError) throw restaurantError;
      }

      // If changing FROM merchant to another role, clear merchant_id from any restaurants they owned
      if (roleChangeUser.role === "merchant" && newRole !== "merchant") {
        const { error: clearError } = await supabase
          .from("restaurants")
          .update({ merchant_id: null })
          .eq("merchant_id", roleChangeUser.id);

        if (clearError) throw clearError;
      }

      // Refresh users to get updated data with joins
      await fetchUsers();

      setShowRoleModal(false);
      setRoleChangeUser(null);
      setNewRole("");
      setSelectedRestaurantId("");
      setSelectedBranchId("");
      showSuccessToast(`User role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      showErrorToast("Failed to update role");
    } finally {
      setRoleChangeLoading(false);
    }
  };

  // Open role change modal
  const openRoleChangeModal = (user: User) => {
    setRoleChangeUser(user);
    setNewRole(user.role);
    setSelectedRestaurantId(user.restaurant_id || "");
    setSelectedBranchId(user.branch_id || "");
    setShowRoleModal(true);
  };

  // Close role change modal
  const closeRoleChangeModal = () => {
    setShowRoleModal(false);
    setRoleChangeUser(null);
    setNewRole("");
    setSelectedRestaurantId("");
    setSelectedBranchId("");
  };

  // Handle sort column click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending (except dates default to desc)
      setSortField(field);
      setSortOrder(field === "created_at" || field === "last_login" ? "desc" : "asc");
    }
  };

  // Get sort icon for column header
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  // Filter branches by selected restaurant
  const filteredBranches = selectedRestaurantId ? branches.filter((b) => b.restaurant_id === selectedRestaurantId) : [];

  // Filter users by search query and role
  const filteredUsers = users
    .filter((user) => {
      // Search filter
      const matchesSearch =
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    // Sort users
    .sort((a, b) => {
      let comparison = 0;

      // Role hierarchy for sorting: admin (4) > merchant (3) > staff (2) > customer (1)
      const roleHierarchy: Record<string, number> = {
        admin: 4,
        merchant: 3,
        staff: 2,
        customer: 1,
      };

      switch (sortField) {
        case "full_name":
          comparison = (a.full_name || "").localeCompare(b.full_name || "");
          break;
        case "role":
          // Sort by hierarchy instead of alphabetically
          comparison = (roleHierarchy[a.role] || 0) - (roleHierarchy[b.role] || 0);
          break;
        case "created_at":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "last_login":
          const aLogin = a.last_login ? new Date(a.last_login).getTime() : 0;
          const bLogin = b.last_login ? new Date(b.last_login).getTime() : 0;
          comparison = aLogin - bLogin;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          </div>
          {/* User count badge */}
          <div className="text-sm text-gray-500">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            {roleFilter !== "all" && ` (${roleFilter})`}
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {/* Role filter dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customers</option>
                  <option value="staff">Staff</option>
                  <option value="merchant">Merchants</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {/* Sortable User column */}
                  <th
                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700 select-none"
                    onClick={() => handleSort("full_name")}
                  >
                    User {getSortIcon("full_name")}
                  </th>
                  {/* Sortable Role column */}
                  <th
                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700 select-none"
                    onClick={() => handleSort("role")}
                  >
                    Role {getSortIcon("role")}
                  </th>
                  {/* Restaurant/Branch column - not sortable */}
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Restaurant / Branch</th>
                  {/* Sortable Joined column */}
                  <th
                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700 select-none"
                    onClick={() => handleSort("created_at")}
                  >
                    Joined {getSortIcon("created_at")}
                  </th>
                  {/* Sortable Last Login column */}
                  <th
                    className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700 select-none"
                    onClick={() => handleSort("last_login")}
                  >
                    Last Login {getSortIcon("last_login")}
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      {/* User info cell */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{user.full_name || "No Name"}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      {/* Role badge cell */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "merchant"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "staff"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      {/* Restaurant/Branch info cell - max 3 restaurants displayed for merchants */}
                      <td className="px-6 py-4 text-sm">
                        {user.role === "merchant" ? (
                          user.owned_restaurants && user.owned_restaurants.length > 0 ? (
                            <div>
                              <div className="font-medium text-purple-700">
                                {/* Display max 3 restaurants, show "+N more" if exceeded */}
                                {user.owned_restaurants
                                  .slice(0, 3)
                                  .map((r) => r.name)
                                  .join(", ")}
                                {user.owned_restaurants.length > 3 && (
                                  <span className="text-purple-500"> +{user.owned_restaurants.length - 3} more</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-400">
                                {user.owned_restaurants.length} restaurant
                                {user.owned_restaurants.length !== 1 ? "s" : ""} owned
                              </div>
                            </div>
                          ) : (
                            <span className="text-amber-600 text-xs">No restaurant assigned</span>
                          )
                        ) : user.role === "staff" && user.restaurant ? (
                          <div>
                            <div className="font-medium text-orange-700">{user.restaurant.name}</div>
                            <div className="text-xs text-gray-500">{user.branch?.name || "No branch"}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      {/* Joined date cell */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      {/* Last login cell */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                      </td>
                      {/* Actions cell */}
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" onClick={() => openRoleChangeModal(user)}>
                          <Edit className="h-4 w-4 text-gray-400 hover:text-gray-900" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && roleChangeUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Edit User Role</h3>
              <p className="text-sm text-gray-500 mt-1">{roleChangeUser.full_name || roleChangeUser.email}</p>
            </div>

            {/* Modal body */}
            <div className="px-6 py-4 space-y-4">
              {/* Role selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => {
                    setNewRole(e.target.value);
                    // Clear restaurant/branch when switching to customer/admin
                    if (e.target.value === "customer" || e.target.value === "admin") {
                      setSelectedRestaurantId("");
                      setSelectedBranchId("");
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="merchant">Merchant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Restaurant selection - shown for staff and merchant */}
              {(newRole === "staff" || newRole === "merchant") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedRestaurantId}
                    onChange={(e) => {
                      setSelectedRestaurantId(e.target.value);
                      setSelectedBranchId(""); // Reset branch when restaurant changes
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a restaurant...</option>
                    {restaurants.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  {restaurants.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">No active restaurants found</p>
                  )}
                </div>
              )}

              {/* Branch selection - shown only for staff */}
              {newRole === "staff" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={!selectedRestaurantId}
                  >
                    <option value="">Select a branch...</option>
                    {filteredBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  {selectedRestaurantId && filteredBranches.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">No active branches for this restaurant</p>
                  )}
                  {!selectedRestaurantId && <p className="text-xs text-gray-400 mt-1">Select a restaurant first</p>}
                </div>
              )}

              {/* Info message for role requirements */}
              {newRole === "staff" && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-xs text-orange-700">
                    Staff members must be assigned to a specific restaurant and branch to process transactions.
                  </p>
                </div>
              )}
              {newRole === "merchant" && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-xs text-purple-700">
                    Merchants own a restaurant and can access all branches and analytics for that restaurant.
                  </p>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={closeRoleChangeModal} disabled={roleChangeLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleRoleUpdate}
                disabled={roleChangeLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {roleChangeLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
