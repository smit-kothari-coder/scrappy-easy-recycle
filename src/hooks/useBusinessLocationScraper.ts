import { useState } from 'react';
import { toast } from 'sonner';
import { type Location } from '@/types/location';
import { supabase } from '@/lib/supabase';

export const useBusinessLocationScraper = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrapeBusinessLocation = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { locations: scrapedLocations }, error: scrapeError } = await supabase
        .functions.invoke('scrape-business-locations', {
          body: { url }
        });

      if (scrapeError) throw scrapeError;

      if (!scrapedLocations || !Array.isArray(scrapedLocations) || scrapedLocations.length === 0) {
        toast.info('No locations found on this website');
        setLocations([]);
        return;
      }

      const formattedLocations: Location[] = scrapedLocations.map((loc: any) => ({
        id: loc.id || crypto.randomUUID(),
        name: loc.name,
        address: loc.address,
        latitude: loc.latitude,
        longitude: loc.longitude,
        summary: loc.summary || undefined
      }));

      setLocations(formattedLocations);
      toast.success(`Found ${formattedLocations.length} locations`);

    } catch (err) {
      console.error('Error scraping locations:', err);
      setError(err instanceof Error ? err.message : 'Failed to scrape locations');
      toast.error('Failed to scrape locations. Please try again.');
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    scrapeBusinessLocation,
    locations,
    isLoading,
    error
  };
};
