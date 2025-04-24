import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/hooks/useAuth';
import { Pickup } from '@/types';

const PickupHistory = () => {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPickups = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('pickups')
          .select('*, scrappers(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPickups(data || []);
      } catch (error) {
        console.error('Error fetching pickup history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPickups();
  }, [user, supabase]);

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      {pickups.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Scrapper</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price (₹)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pickups.map((pickup) => (
              <TableRow key={pickup.id}>
                <TableCell>{new Date(pickup.pickup_time).toLocaleDateString()}</TableCell>
                <TableCell>{pickup.scrappers?.name || 'Pending'}</TableCell>
                <TableCell>{pickup.weight}</TableCell>
                <TableCell>{pickup.type}</TableCell>
                <TableCell>{pickup.price || '-'}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    pickup.status === 'Completed' 
                      ? 'text-green-800 bg-green-100'
                      : pickup.status === 'Rejected'
                      ? 'text-red-800 bg-red-100'
                      : 'text-blue-800 bg-blue-100'
                  }`}>
                    {pickup.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>No pickups yet</p>
        </div>
      )}
    </div>
  );
};

export default PickupHistory;
