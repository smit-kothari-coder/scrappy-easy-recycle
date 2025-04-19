
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BusinessLocation {
  id: string;
  name: string;
  address: string;
  summary: string | null;
  latitude: number;
  longitude: number;
  created_at?: string;
}

export const useBusinessLocationScraper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<BusinessLocation[]>([]);

  const scrapeBusinessLocation = async (url: string) => {
    setIsLoading(true);
    try {
      const { data: scrapedData, error } = await supabase.functions.invoke('scrape-business-locations', {
        body: JSON.stringify({ url })
      });

      if (error) throw error;

      const { data: newLocation, error: insertError } = await supabase
        .from('business_locations')
        .insert(scrapedData)
        .select()
        .single();

      if (insertError) throw insertError;

      setLocations(prev => [...prev, newLocation as BusinessLocation]);
      toast.success('Business location scraped successfully!');
    } catch (error) {
      console.error('Scraping error:', error);
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }

    return locations;
  };

  return { scrapeBusinessLocation, locations, isLoading };
};
