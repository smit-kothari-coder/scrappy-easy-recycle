
import { useState, useEffect } from 'react';
import { ProfileForm } from '@/components/ProfileForm';
import { useAuth } from '@/hooks/useAuth';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from 'sonner';

const UserProfilePage = () => {
  const { user } = useAuth();
  const { getProfile, updateProfile } = useSupabase();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const profile = await getProfile(user.id);
        setInitialData({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
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
  }, [user, getProfile]);

  const handleSubmit = async (data) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    const updateData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    };
    
    // Only include password if changed
    if (data.password) {
      // In a real app, you'd handle the password update through auth APIs
      console.log('Password would be updated here');
    }
    
    await updateProfile(user.id, updateData);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return <ProfileForm type="user" initialData={initialData} onSubmit={handleSubmit} />;
};

export default UserProfilePage;
