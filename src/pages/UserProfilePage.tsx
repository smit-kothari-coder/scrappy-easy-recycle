
import { useState, useEffect } from 'react';
import { ProfileForm } from '@/components/ProfileForm';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const UserProfilePage = () => {
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { getProfile, updateProfile } = useSupabase();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const profileData = await getProfile(user.id);
        setInitialData({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone || '',
          address: profileData.address || '',
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Could not load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, getProfile]);

  const handleSubmit = async (data: any) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    const { password, ...profileData } = data;
    
    try {
      await updateProfile(user.id, profileData);
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
      type="user" 
      initialData={initialData} 
      onSubmit={handleSubmit} 
    />
  );
};

export default UserProfilePage;
