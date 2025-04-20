
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Profile } from '@/types';

export const useProfileSupabase = () => {
  const getProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data as Profile;
  }, []);

  const updateProfile = useCallback(async (userId: string, updates: Partial<Database['public']['Tables']['users']['Update']>) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  }, []);

  return {
    getProfile,
    updateProfile,
  };
};
