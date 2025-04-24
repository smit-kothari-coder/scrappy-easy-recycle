import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBusinessLocationScraper } from '@/hooks/useBusinessLocationScraper';
import { type Location } from '@/types/location';
import { supabase } from '@/lib/supabase';

const BusinessLocationScraper: React.FC = () => {
  const [url, setUrl] = useState('');
  const { scrapeBusinessLocation, locations, isLoading, error } = useBusinessLocationScraper();

  const handleScrape = () => {
    if (!url) {
      return;
    }
    scrapeBusinessLocation(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL to scrape" 
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          onClick={handleScrape} 
          disabled={isLoading || !url}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? 'Scraping...' : 'Scrape'}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}

      {locations.length > 0 && (
        <div className="space-y-4">
          <div className="text-center text-sm text-gray-500">
            Found {locations.length} locations
          </div>
          
          <div className="grid gap-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{location.name}</h3>
                  {location.summary && (
                    <p className="text-sm text-gray-600">{location.summary}</p>
                  )}
                  <p className="text-sm text-gray-500">{location.address}</p>
                  <div className="text-xs text-gray-400">
                    Coordinates: {location.latitude}, {location.longitude}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessLocationScraper;
