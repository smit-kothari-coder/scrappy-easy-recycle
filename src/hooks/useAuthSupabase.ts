
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthSupabase = () => {
  const getCurrentUser = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  }, []);

  return {
    getCurrentUser,
    logout,
  };
};
