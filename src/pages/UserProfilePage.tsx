
import { ProfileForm } from '@/components/ProfileForm';

const UserProfilePage = () => {
  const handleSubmit = async (data: any) => {
    console.log('Update user profile:', data);
    // TODO: Implement with Supabase
  };

  return <ProfileForm type="user" onSubmit={handleSubmit} />;
};

export default UserProfilePage;
