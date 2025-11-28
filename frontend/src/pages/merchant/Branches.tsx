import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, Plus, Edit, Trash2, Building2, MapPin, Phone } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export default function BranchesManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      if (!user?.restaurant_id) return;

      try {
        setLoading(true);

        const { data } = await supabase
          .from('branches')
          .select('*')
          .eq('restaurant_id', user.restaurant_id)
          .order('created_at', { ascending: false });

        if (data) {
          setBranches(data);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [user]);

  const handleDeactivate = async (branchId: string) => {
    if (!confirm('Are you sure you want to deactivate this branch?')) return;

    try {
      const { error } = await supabase
        .from('branches')
        .update({ is_active: false })
        .eq('id', branchId);

      if (error) throw error;

      setBranches(branches.map(b => 
        b.id === branchId ? { ...b, is_active: false } : b
      ));
    } catch (error) {
      console.error('Error deactivating branch:', error);
      alert('Failed to deactivate branch');
    }
  };

  const handleReactivate = async (branchId: string) => {
    try {
      const { error } = await supabase
        .from('branches')
        .update({ is_active: true })
        .eq('id', branchId);

      if (error) throw error;

      setBranches(branches.map(b => 
        b.id === branchId ? { ...b, is_active: true } : b
      ));
    } catch (error) {
      console.error('Error reactivating branch:', error);
      alert('Failed to reactivate branch');
    }
  };

  const activeBranches = branches.filter(b => b.is_active);
  const inactiveBranches = branches.filter(b => !b.is_active);

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-light px-6 pt-10 pb-7 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/merchant/dashboard')}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">
              Manage Branches
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              Add and manage restaurant branches
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Branches</p>
                  <p className="text-2xl font-bold text-foreground">{activeBranches.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-900/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-foreground">{inactiveBranches.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Branch Button */}
        <Button
          onClick={() => navigate('/merchant/branches/add')}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Branch
        </Button>

        {/* Active Branches List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Active Branches</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
            ) : activeBranches.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No active branches. Click "Add New Branch" to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {activeBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-start justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground mb-2">{branch.name}</p>
                      <div className="space-y-1">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{branch.address}</span>
                        </div>
                        {branch.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <span>{branch.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/merchant/branches/edit/${branch.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeactivate(branch.id)}
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

        {/* Inactive Branches List */}
        {inactiveBranches.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Inactive Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inactiveBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-start justify-between p-4 rounded-lg bg-muted/50 opacity-60"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground mb-2">{branch.name}</p>
                      <div className="space-y-1">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{branch.address}</span>
                        </div>
                        <p className="text-xs text-red-600">Deactivated</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReactivate(branch.id)}
                      className="ml-4"
                    >
                      Reactivate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
