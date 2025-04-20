
import { useState, useEffect } from 'react';
import { ProfileForm } from '@/components/ProfileForm';
import { useAuth } from '@/hooks/useAuth';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from 'sonner';

const ScrapperProfilePage = () => {
  const { user } = useAuth();
  const { getScrapper, updateScrapper } = useSupabase();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrapperId, setScrapperId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const scrapper = await getScrapper(user.email);
        setScrapperId(scrapper.id);
        setInitialData({
          name: scrapper.name || '',
          email: scrapper.email || '',
          phone: scrapper.phone || '',
          vehicleType: scrapper.vehicle_type || '',
          hours: scrapper.availability_hours || '',
          scrapTypes: scrapper.scrap_types || [],
          password: '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, getScrapper]);

  const handleSubmit = async (data) => {
    if (!user || !scrapperId) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    const updateData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      vehicle_type: data.vehicleType,
      availability_hours: data.hours,
      scrap_types: data.scrapTypes,
    };
    
    // Only include password if changed
    if (data.password) {
      // In a real app, you'd handle the password update through auth APIs
      console.log('Password would be updated here');
    }
    
    await updateScrapper(scrapperId, updateData);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return <ProfileForm type="scrapper" initialData={initialData} onSubmit={handleSubmit} />;
};

export default ScrapperProfilePage;
