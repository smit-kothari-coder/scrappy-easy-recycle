
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader, MapPin, ArrowLeft } from 'lucide-react';
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

// Custom marker icon to mimic Ola/Uber style
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

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<BusinessLocation[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Default position (London)
  const defaultPosition: [number, number] = [51.505, -0.09];

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
        // Add new location to the array
        setLocations(prev => [...prev, data]);
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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Business Location Dashboard</h1>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Business Location</CardTitle>
          </CardHeader>
          <CardContent>
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
              <div className="p-4 mt-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full rounded-md overflow-hidden border">
              {typeof window !== 'undefined' && (
                <MapContainer 
                  style={{ height: '400px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {locations.map((location, index) => (
                    <Marker 
                      key={index}
                      position={[location.latitude, location.longitude]}
                      icon={createCustomIcon()}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-base">{location.name}</h3>
                          <p className="text-sm mt-1">{location.address}</p>
                          {location.summary && (
                            <p className="text-xs mt-2 text-gray-600">{location.summary}</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Attribution for OpenStreetMap */}
                  <div className="absolute bottom-0 right-0 z-[1000] bg-white bg-opacity-70 px-1 text-xs">
                    © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors
                  </div>
                </MapContainer>
              )}
            </div>
            
            {locations.length === 0 && (
              <p className="text-center mt-4 text-gray-500">No locations found. Use the search above to scrape business locations.</p>
            )}
            
            {locations.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Scraped Locations ({locations.length})</h3>
                <div className="space-y-2">
                  {locations.map((location, index) => (
                    <div key={index} className="p-2 border rounded-md">
                      <h4 className="font-medium">{location.name}</h4>
                      <p className="text-sm text-gray-600">{location.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
