
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSupabase } from '@/hooks/useSupabase';
import { Scrapper } from '@/types';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Define props with proper types
interface ExtendedMapContainerProps extends MapContainerProps {
  center: L.LatLngExpression;
  zoom: number;
  style?: React.CSSProperties;
  className?: string;
}

const ScrapperMap: React.FC = () => {
  const [scrappers, setScrappers] = useState<Scrapper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getActiveScrappers } = useSupabase();
  
  // Default center position (India)
  const defaultPosition: [number, number] = [20.5937, 78.9629];
  
  useEffect(() => {
    const fetchScrappers = async () => {
      try {
        const data = await getActiveScrappers();
        setScrappers(data);
      } catch (error) {
        console.error("Error fetching scrappers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchScrappers();
  }, [getActiveScrappers]);
  
  if (isLoading) {
    return <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">Loading map...</div>;
  }
  
  return (
    <div className="w-full h-[400px]">
      <MapContainer 
        center={defaultPosition}
        zoom={5}
        style={{ height: '400px', width: '100%' }}
        className="w-full h-full rounded-lg"
        {...{} as ExtendedMapContainerProps}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          {...{attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'} as any}
        />
        
        {scrappers.map((scrapper) => (
          scrapper.latitude && scrapper.longitude ? (
            <Marker 
              key={scrapper.id}
              position={[scrapper.latitude, scrapper.longitude]}
            >
              <Popup>
                <div>
                  <strong className="text-base">{scrapper.name}</strong>
                  <p className="text-base">Vehicle: {scrapper.vehicle_type || 'Not specified'}</p>
                  <p className="text-base">Phone: {scrapper.phone}</p>
                  <p className="text-base">City: {scrapper.city}</p>
                  <p className="text-base">Rating: {scrapper.rating}/5</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
};

export default ScrapperMap;
