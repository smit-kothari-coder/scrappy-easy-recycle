
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBusinessLocationScraper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);

  const scrapeBusinessLocation = async (url: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-business-locations', {
        body: JSON.stringify({ url })
      });

      if (error) throw error;

      // Store in Supabase
      const { data: newLocation, error: insertError } = await supabase
        .from('business_locations')
        .insert(data)
        .select();

      if (insertError) throw insertError;

      setLocations(prev => [...prev, newLocation[0]]);
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
