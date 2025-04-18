
import { ProfileForm } from '@/components/ProfileForm';

const ScrapperProfilePage = () => {
  const handleSubmit = async (data: any) => {
    console.log('Update scrapper profile:', data);
    // TODO: Implement with Supabase
  };

  return <ProfileForm type="scrapper" onSubmit={handleSubmit} />;
};

export default ScrapperProfilePage;
