
import React, { useState } from 'react';
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

const BusinessLocationScraper = () => {
  const [url, setUrl] = useState('');
  const { scrapeBusinessLocation, locations, isLoading } = useBusinessLocationScraper();

  const handleScrape = () => {
    scrapeBusinessLocation(url);
  };

  // Default center position for the map or the latest location
  const defaultPosition: [number, number] = [51.505, -0.09]; // London as default
  const position: [number, number] = locations.length 
    ? [locations[locations.length - 1].latitude, locations[locations.length - 1].longitude] 
    : defaultPosition;

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL to scrape" 
        />
        <Button onClick={handleScrape} disabled={isLoading}>
          {isLoading ? 'Scraping...' : 'Scrape'}
        </Button>
      </div>

      <MapContainer 
        center={position} 
        zoom={locations.length ? 13 : 2} 
        style={{ height: '400px' }}
        className="w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location, index) => (
          <Marker 
            key={index} 
            position={[location.latitude, location.longitude] as [number, number]}
          >
            <Popup>
              <div>
                <strong>{location.name}</strong>
                <p>{location.summary}</p>
                <small>{location.address}</small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BusinessLocationScraper;
