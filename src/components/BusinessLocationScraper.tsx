
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBusinessLocationScraper } from '@/hooks/useBusinessLocationScraper';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const BusinessLocationScraper: React.FC = () => {
  const [url, setUrl] = useState('');
  const { scrapeBusinessLocation, locations, isLoading } = useBusinessLocationScraper();
  const [mapKey, setMapKey] = useState(0);

  const handleScrape = () => {
    scrapeBusinessLocation(url);
  };

  const defaultPosition: [number, number] = [51.505, -0.09]; // London as default
  const mapCenter = locations.length > 0
    ? [locations[locations.length - 1].latitude, locations[locations.length - 1].longitude] as [number, number]
    : defaultPosition;
    
  useEffect(() => {
    if (locations.length > 0) {
      setMapKey(prev => prev + 1);
    }
  }, [locations]);

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

      <div key={mapKey} className="w-full h-[400px]">
        {/* @ts-ignore - Ignore TypeScript errors for react-leaflet props */}
        <MapContainer 
          center={mapCenter}
          zoom={locations.length ? 13 : 2} 
          style={{ height: '400px', width: '100%' }}
          className="w-full h-full rounded-lg"
        >
          {/* @ts-ignore - Ignore TypeScript errors for react-leaflet props */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((location) => (
            // @ts-ignore - Ignore TypeScript errors for react-leaflet props
            <Marker 
              key={location.id}
              position={[location.latitude, location.longitude]}
            >
              {/* @ts-ignore - Ignore TypeScript errors for react-leaflet props */}
              <Popup>
                <div>
                  <strong>{location.name}</strong>
                  <p>{location.summary || ''}</p>
                  <small>{location.address}</small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default BusinessLocationScraper;
