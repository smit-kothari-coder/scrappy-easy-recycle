// src/components/PickupHistory.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Assuming this is used for authentication
import { useSupabase } from '@/hooks/useSupabase'; // Import the useSupabase hook
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pickup } from '@/types';

const PickupHistory = () => {
  const { user } = useAuth();
  const { getPickupHistory, listenToPickupUpdates } = useSupabase();
  const [history, setHistory] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      // Fetch initial pickup history
      const fetchHistory = async () => {
        const data = await getPickupHistory(user.id);
        const formattedData = data.map((item: any) => ({
          id: item.id,
          date: item.date,
          weight: item.weight,
          type: item.type,
          status: item.status,
          scrapper: item.scrappers || null,
          user_id: item.user_id || null,
          scrapper_id: item.scrapper_id || null,
          address: item.address || '',
          time_slot: item.time_slot || '',
          price: item.price || 0,
          latitude: item.latitude || null,
          longitude: item.longitude || null,
          created_at: item.created_at || '',
          pincode: item.pincode || '',
        }));
        setHistory(formattedData);
        setLoading(false);
      };

      fetchHistory();

      // Setup real-time listener for pickup history updates
      const unsubscribe = listenToPickupUpdates(user.id, (newPickup) => {
        setHistory((prevHistory) => [...prevHistory, newPickup]);
      });

      // Cleanup on component unmount
      return unsubscribe;
    }
  }, [user, getPickupHistory, listenToPickupUpdates]);

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      {history.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Scrapper</TableHead>
              <TableHead>Weight (kg)</TableHead>
              <TableHead>Type</TableHead>
              {/* <TableHead>Price (₹)</TableHead> */}
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((pickup) => (
              <TableRow key={pickup.id}>
                <TableCell>{pickup.date}</TableCell>
                <TableCell>{pickup.scrapper?.name || 'XYZ'}</TableCell>
                <TableCell>{pickup.weight}</TableCell>
                <TableCell>{pickup.type}</TableCell>
                {/* <TableCell>{pickup.price}</TableCell> */}
                <TableCell>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    pickup.status === 'Completed' ? 'text-green-800 bg-green-100' : 'text-blue-800 bg-blue-100'
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
