import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, UserPlus, Edit, Trash2, Users } from 'lucide-react';

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  branch_id: string | null;
  branch_name?: string;
  created_at: string;
  is_deleted: boolean;
}

interface Branch {
  id: string;
  name: string;
}

export default function StaffManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.restaurant_id) return;

      try {
        setLoading(true);

        // Fetch branches
        const { data: branchesData } = await supabase
          .from('branches')
          .select('id, name')
          .eq('restaurant_id', user.restaurant_id)
          .eq('is_active', true);

        if (branchesData) {
          setBranches(branchesData);
        }

        // Fetch staff members
        const { data: staffData } = await supabase
          .from('users')
          .select(`
            id,
            full_name,
            email,
            branch_id,
            created_at,
            is_deleted
          `)
          .eq('restaurant_id', user.restaurant_id)
          .eq('role', 'staff')
          .order('created_at', { ascending: false });

        if (staffData) {
          // Map branch names to staff
          const staffWithBranches = staffData.map(s => ({
            ...s,
            branch_name: branchesData?.find(b => b.id === s.branch_id)?.name || 'Unassigned'
          }));
          setStaff(staffWithBranches);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDeactivate = async (staffId: string) => {
    if (!confirm('Are you sure you want to deactivate this staff member?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_deleted: true })
        .eq('id', staffId);

      if (error) throw error;

      // Refresh staff list
      setStaff(staff.map(s => 
        s.id === staffId ? { ...s, is_deleted: true } : s
      ));
    } catch (error) {
      console.error('Error deactivating staff:', error);
      alert('Failed to deactivate staff member');
    }
  };

  const handleReactivate = async (staffId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_deleted: false })
        .eq('id', staffId);

      if (error) throw error;

      // Refresh staff list
      setStaff(staff.map(s => 
        s.id === staffId ? { ...s, is_deleted: false } : s
      ));
    } catch (error) {
      console.error('Error reactivating staff:', error);
      alert('Failed to reactivate staff member');
    }
  };

  const activeStaff = staff.filter(s => !s.is_deleted);
  const inactiveStaff = staff.filter(s => s.is_deleted);

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
              Manage Staff
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              Add and manage staff accounts
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
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Staff</p>
                  <p className="text-2xl font-bold text-foreground">{activeStaff.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-900/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-foreground">{inactiveStaff.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Staff Button */}
        <Button
          onClick={() => navigate('/owner/staff/add')}
          className="w-full"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Staff Member
        </Button>

        {/* Active Staff List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Active Staff Members</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
            ) : activeStaff.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No active staff members. Click "Add New Staff Member" to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {activeStaff.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{member.full_name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Branch: {member.branch_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/owner/staff/edit/${member.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeactivate(member.id)}
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

        {/* Inactive Staff List */}
        {inactiveStaff.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Inactive Staff Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inactiveStaff.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 opacity-60"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{member.full_name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-xs text-red-600">Deactivated</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReactivate(member.id)}
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
