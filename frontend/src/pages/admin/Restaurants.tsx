import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ArrowLeft, Search, Plus, Edit, Power, PowerOff, Store, ChevronLeft, ChevronRight, X } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../components/ui/toast";

// Restaurant record from the database
interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  merchant_id: string | null;
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
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined merchant user info
  merchant?: { id: string; full_name: string; email: string } | null;
}

// Merchant user for the assignment dropdown
interface MerchantUser {
  id: string;
  full_name: string;
  email: string;
}

// Form data for creating/editing a restaurant
interface RestaurantForm {
  name: string;
  slug: string;
  description: string;
  merchant_id: string;
  // Contact & Identity
  email: string;
  website_url: string;
  registration_number: string;
  // Cuisine & Discovery
  cuisine_type: string;
  price_range: string; // stored as string for select input, converted to number on save
  halal_certified: boolean;
  // Visual Branding
  cover_image_url: string;
  // Social media links
  social_facebook: string;
  social_instagram: string;
  social_tiktok: string;
  social_google_maps: string;
  // Reward mechanics
  guaranteed_discount_percent: number;
  upline_reward_percent: number;
  max_redemption_percent: number;
  virtual_currency_expiry_days: number;
}

// Default form values matching database defaults
const defaultFormValues: RestaurantForm = {
  name: "",
  slug: "",
  description: "",
  merchant_id: "",
  email: "",
  website_url: "",
  registration_number: "",
  cuisine_type: "",
  price_range: "",
  halal_certified: false,
  cover_image_url: "",
  social_facebook: "",
  social_instagram: "",
  social_tiktok: "",
  social_google_maps: "",
  guaranteed_discount_percent: 5,
  upline_reward_percent: 1,
  max_redemption_percent: 20,
  virtual_currency_expiry_days: 30,
};

// Common Malaysian cuisine types for the multi-select
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

const PAGE_SIZE = 10;

export default function AdminRestaurants() {
  const navigate = useNavigate();

  // Data state
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [merchants, setMerchants] = useState<MerchantUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state for create/edit
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null); // null = create mode
  const [formData, setFormData] = useState<RestaurantForm>(defaultFormValues);
  const [formLoading, setFormLoading] = useState(false);

  // ============================================================
  // Data fetching
  // ============================================================

  useEffect(() => {
    fetchRestaurants();
    fetchMerchants();
  }, []);

  /** Fetch all restaurants with joined merchant info */
  const fetchRestaurants = async () => {
    try {
      setLoading(true);

      // Fetch restaurants — admin RLS policy grants full access
      const { data, error } = await supabase.from("restaurants").select("*").order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        // Collect unique merchant IDs to fetch their names
        const merchantIds = [...new Set(data.filter((r) => r.merchant_id).map((r) => r.merchant_id!))];

        let merchantMap: Record<string, MerchantUser> = {};
        if (merchantIds.length > 0) {
          const { data: merchantData } = await supabase
            .from("users")
            .select("id, full_name, email")
            .in("id", merchantIds);

          if (merchantData) {
            merchantMap = Object.fromEntries(merchantData.map((m) => [m.id, m]));
          }
        }

        // Attach merchant info to each restaurant
        const restaurantsWithMerchant = data.map((r) => ({
          ...r,
          merchant: r.merchant_id ? merchantMap[r.merchant_id] || null : null,
        }));

        setRestaurants(restaurantsWithMerchant);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      showErrorToast("Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  /** Fetch all merchant users for the assignment dropdown */
  const fetchMerchants = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email")
        .eq("role", "merchant")
        .eq("is_deleted", false)
        .order("full_name");

      if (error) throw error;
      if (data) setMerchants(data);
    } catch (error) {
      console.error("Error fetching merchants:", error);
    }
  };

  // ============================================================
  // Filtering and pagination
  // ============================================================

  /** Apply search and status filter to the restaurant list */
  const filteredRestaurants = restaurants.filter((r) => {
    // Status filter
    if (filterStatus === "active" && !r.is_active) return false;
    if (filterStatus === "inactive" && r.is_active) return false;

    // Search filter (name, slug, merchant name, merchant email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesName = r.name.toLowerCase().includes(query);
      const matchesSlug = r.slug.toLowerCase().includes(query);
      const matchesMerchant =
        r.merchant?.full_name?.toLowerCase().includes(query) || r.merchant?.email?.toLowerCase().includes(query);
      return matchesName || matchesSlug || matchesMerchant;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredRestaurants.length / PAGE_SIZE);
  const paginatedRestaurants = filteredRestaurants.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  // ============================================================
  // Auto-generate slug from restaurant name
  // ============================================================

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Collapse multiple hyphens
      .trim();
  };

  // ============================================================
  // Modal helpers
  // ============================================================

  /** Open modal in create mode */
  const openCreateModal = () => {
    setEditingRestaurant(null);
    setFormData(defaultFormValues);
    setShowModal(true);
  };

  /** Open modal in edit mode with existing restaurant data */
  const openEditModal = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description || "",
      merchant_id: restaurant.merchant_id || "",
      email: restaurant.email || "",
      website_url: restaurant.website_url || "",
      registration_number: restaurant.registration_number || "",
      cuisine_type: restaurant.cuisine_type?.join(", ") || "",
      price_range: restaurant.price_range?.toString() || "",
      halal_certified: restaurant.halal_certified ?? false,
      cover_image_url: restaurant.cover_image_url || "",
      social_facebook: restaurant.social_media?.facebook || "",
      social_instagram: restaurant.social_media?.instagram || "",
      social_tiktok: restaurant.social_media?.tiktok || "",
      social_google_maps: restaurant.social_media?.google_maps_url || "",
      guaranteed_discount_percent: restaurant.guaranteed_discount_percent,
      upline_reward_percent: restaurant.upline_reward_percent,
      max_redemption_percent: restaurant.max_redemption_percent,
      virtual_currency_expiry_days: restaurant.virtual_currency_expiry_days,
    });
    setShowModal(true);
  };

  /** Close modal and reset state */
  const closeModal = () => {
    setShowModal(false);
    setEditingRestaurant(null);
    setFormData(defaultFormValues);
  };

  // ============================================================
  // Create / Update restaurant
  // ============================================================

  /** Build the database payload from form data */
  const buildPayload = () => {
    // Parse cuisine_type from comma-separated string into array
    const cuisineArray = formData.cuisine_type
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    // Build social_media JSONB — only include non-empty values
    const socialMedia: Record<string, string> = {};
    if (formData.social_facebook.trim()) socialMedia.facebook = formData.social_facebook.trim();
    if (formData.social_instagram.trim()) socialMedia.instagram = formData.social_instagram.trim();
    if (formData.social_tiktok.trim()) socialMedia.tiktok = formData.social_tiktok.trim();
    if (formData.social_google_maps.trim()) socialMedia.google_maps_url = formData.social_google_maps.trim();

    return {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim() || null,
      merchant_id: formData.merchant_id || null,
      // Contact & Identity
      email: formData.email.trim() || null,
      website_url: formData.website_url.trim() || null,
      registration_number: formData.registration_number.trim() || null,
      // Cuisine & Discovery
      cuisine_type: cuisineArray.length > 0 ? cuisineArray : null,
      price_range: formData.price_range ? parseInt(formData.price_range) : null,
      halal_certified: formData.halal_certified,
      // Visual Branding
      cover_image_url: formData.cover_image_url.trim() || null,
      // Social & Online Presence
      social_media: Object.keys(socialMedia).length > 0 ? socialMedia : null,
      // Reward mechanics
      guaranteed_discount_percent: formData.guaranteed_discount_percent,
      upline_reward_percent: formData.upline_reward_percent,
      max_redemption_percent: formData.max_redemption_percent,
      virtual_currency_expiry_days: formData.virtual_currency_expiry_days,
    };
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      showErrorToast("Restaurant name is required");
      return;
    }
    if (!formData.slug.trim()) {
      showErrorToast("URL slug is required");
      return;
    }

    try {
      setFormLoading(true);
      const payload = buildPayload();

      if (editingRestaurant) {
        // === UPDATE existing restaurant ===
        const { error } = await supabase
          .from("restaurants")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editingRestaurant.id);

        if (error) throw error;
        showSuccessToast(`"${formData.name}" updated successfully`);
      } else {
        // === CREATE new restaurant ===
        const { error } = await supabase.from("restaurants").insert(payload);

        if (error) {
          // Handle unique constraint violation on slug
          if (error.code === "23505" && error.message.includes("slug")) {
            showErrorToast("This URL slug is already in use. Please choose a different one.");
            return;
          }
          throw error;
        }
        showSuccessToast(`"${formData.name}" created successfully`);
      }

      closeModal();
      fetchRestaurants();
    } catch (error: any) {
      console.error("Error saving restaurant:", error);
      showErrorToast(error.message || "Failed to save restaurant");
    } finally {
      setFormLoading(false);
    }
  };

  // ============================================================
  // Deactivate / Reactivate restaurant
  // ============================================================

  const handleToggleActive = async (restaurant: Restaurant) => {
    const newStatus = !restaurant.is_active;
    const action = newStatus ? "reactivate" : "deactivate";

    if (!confirm(`Are you sure you want to ${action} "${restaurant.name}"?`)) return;

    try {
      const { error } = await supabase
        .from("restaurants")
        .update({
          is_active: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", restaurant.id);

      if (error) throw error;

      showSuccessToast(`"${restaurant.name}" ${action}d successfully`);
      fetchRestaurants();
    } catch (error: any) {
      console.error(`Error ${action} restaurant:`, error);
      showErrorToast(error.message || `Failed to ${action} restaurant`);
    }
  };

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/admin/dashboard")}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">Manage Restaurants</h1>
            <p className="text-primary-foreground/80 text-sm">Create, edit, and manage all restaurants</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-green-50 p-2.5 rounded-full">
                <Store className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{restaurants.filter((r) => r.is_active).length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-gray-100 p-2.5 rounded-full">
                <PowerOff className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Inactive</p>
                <p className="text-xl font-bold">{restaurants.filter((r) => !r.is_active).length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-purple-50 p-2.5 rounded-full">
                <Store className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{restaurants.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create button + Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={openCreateModal} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            New Restaurant
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, slug, or merchant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Restaurant table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <p className="text-center text-muted-foreground py-12">Loading restaurants...</p>
            ) : filteredRestaurants.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No restaurants found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium">Restaurant</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Slug</th>
                      <th className="text-left px-4 py-3 font-medium">Merchant</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Status</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRestaurants.map((restaurant) => (
                      <tr key={restaurant.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{restaurant.name}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">{restaurant.slug}</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{restaurant.slug}</td>
                        <td className="px-4 py-3">
                          {restaurant.merchant ? (
                            <div>
                              <p className="text-foreground">{restaurant.merchant.full_name}</p>
                              <p className="text-xs text-muted-foreground">{restaurant.merchant.email}</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              restaurant.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {restaurant.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(restaurant)}
                              title="Edit restaurant"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            {/* Deactivate / Reactivate button */}
                            <Button
                              variant={restaurant.is_active ? "destructive" : "outline"}
                              size="sm"
                              onClick={() => handleToggleActive(restaurant)}
                              title={restaurant.is_active ? "Deactivate" : "Reactivate"}
                            >
                              {restaurant.is_active ? (
                                <PowerOff className="h-3.5 w-3.5" />
                              ) : (
                                <Power className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filteredRestaurants.length)} of {filteredRestaurants.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-2">
                    {currentPage} / {totalPages}
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
          </CardContent>
        </Card>
      </div>

      {/* ============================================================ */}
      {/* Create / Edit Modal                                          */}
      {/* ============================================================ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingRestaurant ? "Edit Restaurant" : "Create New Restaurant"}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-4 space-y-4">
              {/* ── Section: Identity ── */}
              <p className="text-sm font-semibold text-foreground">Identity</p>

              {/* Restaurant name */}
              <div>
                <Label htmlFor="restaurant-name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="restaurant-name"
                  value={formData.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setFormData({
                      ...formData,
                      name: newName,
                      // Auto-generate slug only in create mode
                      ...(editingRestaurant ? {} : { slug: generateSlug(newName) }),
                    });
                  }}
                  placeholder="e.g. Chuan Xing Steamboat"
                />
              </div>

              {/* URL slug */}
              <div>
                <Label htmlFor="restaurant-slug">
                  URL Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="restaurant-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. chuan-xing-steamboat"
                  disabled={!!editingRestaurant} // Slug is read-only after creation
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used in referral links: /join/{formData.slug || "..."}/CODE
                  {editingRestaurant && " (cannot be changed after creation)"}
                </p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="restaurant-description">Description</Label>
                <textarea
                  id="restaurant-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the restaurant"
                  className="w-full min-h-[60px] px-3 py-2 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* SSM Registration number */}
              <div>
                <Label htmlFor="registration-number">SSM Registration No.</Label>
                <Input
                  id="registration-number"
                  value={formData.registration_number}
                  onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                  placeholder="e.g. 202301012345 (12-digit)"
                />
              </div>

              {/* Merchant assignment */}
              <div>
                <Label htmlFor="restaurant-merchant">Assign Merchant</Label>
                <select
                  id="restaurant-merchant"
                  value={formData.merchant_id}
                  onChange={(e) => setFormData({ ...formData, merchant_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">No merchant assigned</option>
                  {merchants.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>

              <hr className="border-gray-200" />

              {/* ── Section: Contact ── */}
              <p className="text-sm font-semibold text-foreground">Contact</p>

              <div className="grid grid-cols-2 gap-3">
                {/* Business email */}
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="restaurant-email">Email</Label>
                  <Input
                    id="restaurant-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@restaurant.com"
                  />
                </div>

                {/* Website */}
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="restaurant-website">Website</Label>
                  <Input
                    id="restaurant-website"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://restaurant.com"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* ── Section: Cuisine & Discovery ── */}
              <p className="text-sm font-semibold text-foreground">Cuisine & Discovery</p>

              {/* Cuisine type — comma-separated tags with suggestions */}
              <div>
                <Label htmlFor="cuisine-type">Cuisine Tags</Label>
                <Input
                  id="cuisine-type"
                  value={formData.cuisine_type}
                  onChange={(e) => setFormData({ ...formData, cuisine_type: e.target.value })}
                  placeholder="e.g. Chinese, Steamboat, Seafood"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {CUISINE_OPTIONS.map((cuisine) => {
                    const currentTags = formData.cuisine_type.split(",").map((t) => t.trim().toLowerCase());
                    const isSelected = currentTags.includes(cuisine.toLowerCase());
                    return (
                      <button
                        key={cuisine}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            // Remove this tag
                            const updated = formData.cuisine_type
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t.toLowerCase() !== cuisine.toLowerCase())
                              .join(", ");
                            setFormData({ ...formData, cuisine_type: updated });
                          } else {
                            // Add this tag
                            const current = formData.cuisine_type.trim();
                            const updated = current ? `${current}, ${cuisine}` : cuisine;
                            setFormData({ ...formData, cuisine_type: updated });
                          }
                        }}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
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

              <div className="grid grid-cols-2 gap-3">
                {/* Price range */}
                <div>
                  <Label htmlFor="price-range">Price Range</Label>
                  <select
                    id="price-range"
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Not set</option>
                    <option value="1">$ — Budget (&lt; RM15)</option>
                    <option value="2">$$ — Moderate (RM15–40)</option>
                    <option value="3">$$$ — Premium (RM40+)</option>
                  </select>
                </div>

                {/* Halal certified */}
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.halal_certified}
                      onChange={(e) => setFormData({ ...formData, halal_certified: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">Halal Certified</span>
                  </label>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* ── Section: Branding ── */}
              <p className="text-sm font-semibold text-foreground">Branding</p>

              <div>
                <Label htmlFor="cover-image">Cover Image URL</Label>
                <Input
                  id="cover-image"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://images.example.com/cover.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Banner image for the restaurant profile. Logo URL can be set separately.
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* ── Section: Social Media ── */}
              <p className="text-sm font-semibold text-foreground">Social Media</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="social-facebook">Facebook</Label>
                  <Input
                    id="social-facebook"
                    value={formData.social_facebook}
                    onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="social-instagram">Instagram</Label>
                  <Input
                    id="social-instagram"
                    value={formData.social_instagram}
                    onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="social-tiktok">TikTok</Label>
                  <Input
                    id="social-tiktok"
                    value={formData.social_tiktok}
                    onChange={(e) => setFormData({ ...formData, social_tiktok: e.target.value })}
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
                <div>
                  <Label htmlFor="social-google-maps">Google Maps</Label>
                  <Input
                    id="social-google-maps"
                    value={formData.social_google_maps}
                    onChange={(e) => setFormData({ ...formData, social_google_maps: e.target.value })}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* ── Section: Discount & Rewards ── */}
              <p className="text-sm font-semibold text-foreground">Discount & Rewards</p>

              <div className="grid grid-cols-2 gap-3">
                {/* Guaranteed discount */}
                <div>
                  <Label htmlFor="guaranteed-discount">First-Time Discount (%)</Label>
                  <Input
                    id="guaranteed-discount"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.guaranteed_discount_percent}
                    onChange={(e) =>
                      setFormData({ ...formData, guaranteed_discount_percent: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                {/* Upline reward */}
                <div>
                  <Label htmlFor="upline-reward">Upline Reward (%)</Label>
                  <Input
                    id="upline-reward"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.upline_reward_percent}
                    onChange={(e) =>
                      setFormData({ ...formData, upline_reward_percent: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                {/* Max redemption */}
                <div>
                  <Label htmlFor="max-redemption">Max VC Redemption (%)</Label>
                  <Input
                    id="max-redemption"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.max_redemption_percent}
                    onChange={(e) =>
                      setFormData({ ...formData, max_redemption_percent: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>

                {/* VC expiry days */}
                <div>
                  <Label htmlFor="vc-expiry">VC Expiry (Days)</Label>
                  <Input
                    id="vc-expiry"
                    type="number"
                    min="1"
                    value={formData.virtual_currency_expiry_days}
                    onChange={(e) =>
                      setFormData({ ...formData, virtual_currency_expiry_days: parseInt(e.target.value) || 30 })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
              <Button variant="outline" onClick={closeModal} disabled={formLoading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={formLoading}>
                {formLoading ? "Saving..." : editingRestaurant ? "Save Changes" : "Create Restaurant"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
