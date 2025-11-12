import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MenuItemManagement } from '../../components/staff';
import { supabase } from '../../lib/supabase';

export function MenuManagement() {
  const navigate = useNavigate();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    loadStaffInfo();
  }, []);

  const loadStaffInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/staff/login');

    const { data } = await supabase
      .from('users')
      .select('restaurant_id')
      .eq('id', user.id)
      .single();

    if (data?.restaurant_id) setRestaurantId(data.restaurant_id);
  };

  if (!restaurantId) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <button
        onClick={() => navigate('/staff')}
        className="fixed top-4 left-4 z-20 h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <MenuItemManagement restaurantId={restaurantId} />
    </div>
  );
}
