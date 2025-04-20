
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Define a custom icon to mimic Ola/Uber style
const createCustomIcon = () => {
  return L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

interface BusinessLocation {
  name: string;
  address: string;
  summary: string;
  latitude: number;
  longitude: number;
}

const BusinessLocationSearch: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessLocation, setBusinessLocation] = useState<BusinessLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Default position (London)
  const defaultPosition: [number, number] = [51.505, -0.09];
  const position: [number, number] = businessLocation 
    ? [businessLocation.latitude, businessLocation.longitude] 
    : defaultPosition;

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
          {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
          {isLoading ? 'Searching...' : 'Scrape Data'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <div className="h-[400px] w-full rounded-md overflow-hidden border">
        {typeof window !== 'undefined' && (
          <MapContainer 
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {businessLocation && (
              <Marker 
                position={[businessLocation.latitude, businessLocation.longitude]}
                icon={createCustomIcon()}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-base">{businessLocation.name}</h3>
                    <p className="text-sm mt-1">{businessLocation.address}</p>
                    {businessLocation.summary && (
                      <p className="text-xs mt-2 text-gray-600">{businessLocation.summary}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Attribution for OpenStreetMap */}
            <div className="absolute bottom-0 right-0 z-[1000] bg-white bg-opacity-70 px-1 text-xs">
              © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors
            </div>
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default BusinessLocationSearch;
