import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Settings, 
  LogOut, 
  Package, 
  Clock, 
  Truck,
  Recycle,
  AlertCircle,
  Star
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from 'sonner';
import type { Scrapper } from '@/types';

const ScrapperDashboard = () => {
  const { user, signOut } = useAuth();
  const { supabase } = useSupabase();
  const [scrapperData, setScrapperData] = useState<Scrapper | null>(null);
  const [pickupRequests, setPickupRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPickups: 0,
    totalWeight: 0,
    rating: 0
  });

  useEffect(() => {
    if (user?.email) {
      fetchScrapperData();
    }
  }, [user]);

  useEffect(() => {
    if (scrapperData?.id) {
      console.log('Scrapper data loaded, fetching requests and stats');
      fetchPickupRequests();
      fetchStats();
    }
  }, [scrapperData]);

  const fetchScrapperData = async () => {
    try {
      if (!user?.email) {
        toast.error('User information not available');
        return;
      }

      const { data, error } = await supabase
        .from('scrappers')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) throw error;
      setScrapperData(data);
    } catch (error) {
      console.error('Error fetching scrapper data:', error);
      toast.error('Failed to load scrapper information');
    }
  };

  const fetchPickupRequests = async () => {
    if (!scrapperData?.id) {
      console.log('No scrapper ID available yet');
      return;
    }

    try {
      console.log('Fetching pickup requests for scrapper:', scrapperData.id);
      
      const { data, error } = await supabase
        .from('pickups')
        .select(`
          *,
          users:user_id (
            full_name,
            phone
          )
        `)
        .eq('scrapper_id', scrapperData.id)
        .eq('status', 'pending')
        .order('pickup_time', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Received pickup requests:', data);
      setPickupRequests(data || []);
    } catch (error) {
      console.error('Error fetching pickup requests:', error);
      setPickupRequests([]);
      toast.error('Failed to load pickup requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!scrapperData?.id) {
      console.log('No scrapper ID available yet');
      return;
    }

    try {
      console.log('Fetching stats for scrapper:', scrapperData.id);
      
      const { data, error } = await supabase
        .from('pickups')
        .select('weight, rating')
        .eq('scrapper_id', scrapperData.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Received pickup data:', data);

      if (!data) {
        setStats({
          totalPickups: 0,
          totalWeight: 0,
          rating: 0
        });
        return;
      }

      const totalPickups = data.length;
      const totalWeight = data.reduce((sum, pickup) => {
        const weight = pickup?.weight || 0;
        return sum + weight;
      }, 0);

      const validRatings = data.filter(pickup => pickup.rating != null);
      const avgRating = validRatings.length > 0
        ? validRatings.reduce((sum, pickup) => sum + (pickup.rating || 0), 0) / validRatings.length
        : 0;

      console.log('Calculated stats:', {
        totalPickups,
        totalWeight,
        avgRating
      });

      setStats({
        totalPickups,
        totalWeight,
        rating: Number(avgRating.toFixed(1))
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalPickups: 0,
        totalWeight: 0,
        rating: 0
      });
      toast.error('Failed to load statistics');
    }
  };

  const handlePickupAction = async (pickupId: string, action: 'accept' | 'reject') => {
    try {
      const newStatus = action === 'accept' ? 'accepted' : 'rejected';
      
      const { error } = await supabase
        .from('pickups')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', pickupId);

      if (error) throw error;

      toast.success(`Pickup ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
      fetchPickupRequests();
      
      if (action === 'accept') {
        fetchStats();
      }
    } catch (error) {
      console.error(`Error ${action}ing pickup:`, error);
      toast.error(`Failed to ${action} pickup`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Welcome, {scrapperData?.name || 'Scrapper'}!
              </h1>
              <p className="text-gray-600 mt-1">Manage your pickups and profile here</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Link to="/profile" className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="flex-1 md:flex-none text-red-600 hover:bg-red-50"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Pickups</p>
                <p className="text-2xl font-bold">
                  {stats.totalPickups}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Weight</p>
                <p className="text-2xl font-bold">
                  {stats.totalWeight > 0 ? `${stats.totalWeight}kg` : '0kg'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">
                  {stats.rating > 0 ? `${stats.rating}⭐` : 'No ratings'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-gray-600" />
            Vehicle Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Vehicle Type</p>
              <p className="font-semibold">{scrapperData?.vehicle_type || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Registration Number</p>
              <p className="font-semibold">{scrapperData?.vehicle_number || '-'}</p>
            </div>
          </div>
        </div>

        {/* Working Hours & Scrap Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              Working Hours
            </h2>
            <p className="text-lg font-medium">
              {scrapperData?.availability_hours || '9:00 AM - 9:00 PM'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Recycle className="w-5 h-5 text-gray-600" />
              Scrap Types
            </h2>
            <div className="flex flex-wrap gap-2">
              {scrapperData?.scrap_types ? (
                typeof scrapperData.scrap_types === 'string' ? (
                  scrapperData.scrap_types.split(',').map((type: string) => (
                    <span 
                      key={type.trim()}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {type.trim()}
                    </span>
                  ))
                ) : Array.isArray(scrapperData.scrap_types) ? (
                  scrapperData.scrap_types.map((type: string) => (
                    <span 
                      key={type.trim()}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {type.trim()}
                    </span>
                  ))
                ) : null
              ) : (
                <span className="text-gray-500">No scrap types specified</span>
              )}
            </div>
          </div>
        </div>

        {/* Pickup Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            New Pickup Requests
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading requests...</p>
            </div>
          ) : pickupRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No new pickup requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pickupRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="border rounded-xl p-4 hover:border-green-500 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <p className="font-medium">{request.users?.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-600">
                        {request.pickup_time ? new Date(request.pickup_time).toLocaleString() : 'Time not set'}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Address:</span> {request.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Weight:</span> {request.weight}kg
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Phone:</span> {request.users?.phone || 'N/A'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {request.type?.split(',').map((type: string) => (
                          <span 
                            key={type}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                          >
                            {type.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col justify-end">
                      <Button
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 w-full"
                        onClick={() => handlePickupAction(request.id, 'reject')}
                      >
                        Reject
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                        onClick={() => handlePickupAction(request.id, 'accept')}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrapperDashboard;
