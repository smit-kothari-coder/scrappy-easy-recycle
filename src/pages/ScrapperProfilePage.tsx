
import { useState, useEffect } from 'react';
import { ProfileForm } from '@/components/ProfileForm';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const ScrapperProfilePage = () => {
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { getScrapper, updateScrapper } = useSupabase();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const profileData = await getScrapper(user.email!);
        // Parse scrap_types from string to array if it exists
        const scrapTypes = profileData.scrap_types 
          ? Array.isArray(profileData.scrap_types) 
            ? profileData.scrap_types 
            : profileData.scrap_types.split(',')
          : [];

        setInitialData({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone || '',
          vehicleType: profileData.vehicle_type || '',
          hours: profileData.availability_hours || '',
          scrapTypes: scrapTypes,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Could not load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, getScrapper]);

  const handleSubmit = async (data: any) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    const { password, scrapTypes, vehicleType, hours, ...profileData } = data;
    
    try {
      await updateScrapper(initialData.id, {
        ...profileData,
        vehicle_type: vehicleType,
        availability_hours: hours,
        scrap_types: scrapTypes,
      });
      // Handle password update if provided
      if (password?.trim()) {
        // Update password logic would go here if needed
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <ProfileForm 
      type="scrapper" 
      initialData={initialData} 
      onSubmit={handleSubmit} 
    />
  );
};

export default ScrapperProfilePage;
