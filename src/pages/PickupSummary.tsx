import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/hooks/useAuth';

const PickupSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickupData } = location.state || {};
  const { createPickupRequest } = useSupabase();
  const { user } = useAuth();

  const [scrappers, setScrappers] = useState([]);
  const [selectedScrapper, setSelectedScrapper] = useState(null);

  useEffect(() => {
    if (!pickupData) {
      toast.error("Missing pickup data");
      navigate('/');
    } else {
      fetchScrappers();
    }
  }, [pickupData]);

  const fetchScrappers = async () => {
    try {
      // Replace with Supabase fetch logic
      const dummyScrappers = [
        { id: 1, name: "Scrapper A", estimatedPrice: 120 },
        { id: 2, name: "Scrapper B", estimatedPrice: 110 },
        { id: 3, name: "Scrapper C", estimatedPrice: 100 },
      ];
      setScrappers(dummyScrappers);
    } catch (err) {
      toast.error("Failed to fetch scrappers");
    }
  };

  const timeSlotMap = {
    "Morning (8AM - 11AM)": { start: "08:00:00", end: "11:00:00" },
    "Afternoon (12PM - 3PM)": { start: "12:00:00", end: "15:00:00" },
    "Evening (4PM - 7PM)": { start: "16:00:00", end: "19:00:00" },
  };

  const handleFinalSchedule = async () => {
    if (!selectedScrapper) {
      toast.error("Please select a scrapper before scheduling.");
      return;
    }

    try {
      await createPickupRequest({
        user_id: user.id,
        weight: pickupData.weight,
        address: pickupData.streetAddress,
        date: format(new Date(pickupData.date), "yyyy-MM-dd"),
        time_slot: timeSlotMap[pickupData.time_slot],
        type: pickupData.type.join(','),
        pincode: pickupData.pincode,
        latitude: 0, // Replace with real lat/long
        longitude: 0,
        scrapper_id: selectedScrapper.id,
      });

      toast.success("Pickup scheduled successfully!");
      navigate("/user-dashboard"); // Redirecting to the User Dashboard
    } catch (error) {
      toast.error("Failed to schedule pickup.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Pickup Summary</h2>

      <Card className="mb-6">
        <CardContent className="space-y-2 pt-4">
          <p><strong>Address:</strong> {pickupData.fullAddress}</p>
          <p><strong>Date:</strong> {pickupData.formattedDate}</p>
          <p><strong>Time Slot:</strong> {pickupData.time_slot}</p>
          <p><strong>Waste Types:</strong> {pickupData.type.join(', ')}</p>
          <p><strong>Weight:</strong> {pickupData.weight} kg</p>
        </CardContent>
        <div className="p-4">
          <Button onClick={() => navigate(-1)}>Edit</Button>
        </div>
      </Card>

      <h3 className="text-xl font-medium mb-3">Available Scrappers</h3>
      <div className="space-y-4">
        {scrappers.map((scrapper) => (
          <label
            key={scrapper.id}
            className={`block border rounded-lg p-4 cursor-pointer ${
              selectedScrapper?.id === scrapper.id
                ? 'border-scrap-green bg-scrap-green/10'
                : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              name="scrapper"
              value={scrapper.id}
              className="mr-2"
              checked={selectedScrapper?.id === scrapper.id}
              onChange={() => setSelectedScrapper(scrapper)}
            />
            <span className="font-medium">{scrapper.name}</span> — ₹{scrapper.estimatedPrice}
          </label>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          className="bg-scrap-green hover:bg-scrap-green/90 w-full max-w-sm"
          onClick={handleFinalSchedule}
        >
          Schedule Pickup
        </Button>
      </div>
    </div>
  );
};

export default PickupSummary;
