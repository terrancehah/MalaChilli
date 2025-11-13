import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItemManagement } from '../../components/staff';
import { supabase } from '../../lib/supabase';

export function MenuManagement() {
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStaffInfo();
  }, []);

  const loadStaffInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/staff/login');
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('restaurant_id')
        .eq('id', user.id)
        .single();

      if (data?.restaurant_id) {
        setRestaurantId(data.restaurant_id);
      }
    } catch (error) {
      console.error('Error loading staff info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No restaurant assigned to your account</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MenuItemManagement restaurantId={restaurantId} onBack={() => navigate('/staff/dashboard')} />
    </div>
  );
}
