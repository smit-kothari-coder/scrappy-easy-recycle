
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBusinessLocationScraper } from '@/hooks/useBusinessLocationScraper';



const BusinessLocationScraper: React.FC = () => {
  const [url, setUrl] = useState('');
  const { scrapeBusinessLocation, locations, isLoading } = useBusinessLocationScraper();

  const handleScrape = () => {
    scrapeBusinessLocation(url);
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Input 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL to scrape" 
          className="text-base"
        />
        <Button onClick={handleScrape} disabled={isLoading} className="text-base py-2 px-4">
          {isLoading ? 'Scraping...' : 'Scrape'}
        </Button>
      </div>
    </div>
  );
};

export default BusinessLocationScraper;
