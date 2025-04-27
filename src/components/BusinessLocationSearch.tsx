
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Fix for default marker icon


interface BusinessLocation {
  name: string;
  address: string;
  summary: string;
}

const BusinessLocationSearch: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessLocation, setBusinessLocation] = useState<BusinessLocation | null>(null);
  const [error, setError] = useState<string | null>(null);


  const handleSearch = async () => {
    if (!url) {
      toast.error('Please enter a website URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-business', {
        body: { url }
      });

      if (error) throw error;

      if (data) {
        setBusinessLocation(data);
        toast.success('Business location found!');
      } else {
        setError('No business location found.');
        toast.error('No business location found');
      }
    } catch (err) {
      console.error('Error searching business:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to search business location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-semibold">Search Business Location</h2>
        <p className="text-sm text-muted-foreground">
          Enter a business website URL to scrape location information and display it on the map.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter business website URL"
          className="flex-grow"
        />
        <Button
          onClick={handleSearch}
          disabled={isLoading || !url}
          className="whitespace-nowrap"
        >
          {isLoading ? 'Searching...' : 'Search Location'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default BusinessLocationSearch;
