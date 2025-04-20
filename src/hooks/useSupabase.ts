
import { useAuthSupabase } from './useAuthSupabase';
import { useProfileSupabase } from './useProfileSupabase';
import { usePickupSupabase } from './usePickupSupabase';
import { useScrapperSupabase } from './useScrapperSupabase';
import { supabase } from '@/integrations/supabase/client';

export const useSupabase = () => {
  const auth = useAuthSupabase();
  const profile = useProfileSupabase();
  const pickup = usePickupSupabase();
  const scrapper = useScrapperSupabase();

  return {
    ...auth,
    ...profile,
    ...pickup,
    ...scrapper,
    supabase,
  };
};
