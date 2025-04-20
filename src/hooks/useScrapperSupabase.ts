
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Scrapper } from '@/types';

export const useScrapperSupabase = () => {
  const getScrapper = useCallback(async (scrapperEmail: string) => {
    const { data, error } = await supabase
      .from('scrappers')
      .select('*')
      .eq('email', scrapperEmail)
      .single();
    
    if (error) throw error;
    return data as unknown as Scrapper;
  }, []);

  const updateScrapper = useCallback(async (id: string, updates: Partial<Omit<Scrapper, 'availability_hours'> & { availability_hours: string }>) => {
    const { data, error } = await supabase
      .from('scrappers')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as unknown as Scrapper;
  }, []);

  const updateScrappperLocation = useCallback(async (id: string, latitude: number, longitude: number) => {
    const { data, error } = await supabase
      .from('scrappers')
      .update({ latitude, longitude })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }, []);

  const getActiveScrappers = useCallback(async () => {
    const { data, error } = await supabase
      .from('scrappers')
      .select('*')
      .eq('available', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);
    
    if (error) throw error;
    return data as Scrapper[];
  }, []);

  return {
    getScrapper,
    updateScrapper,
    updateScrappperLocation,
    getActiveScrappers,
  };
};
