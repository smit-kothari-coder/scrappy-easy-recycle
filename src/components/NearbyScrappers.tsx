'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Truck } from 'lucide-react';
import { type Scrapper } from '@/types/scrapper';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Predefined list of areas/cities
const AREAS = [
  'Pune',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow'
];

const NearbyScrappers = () => {
  const [selectedArea, setSelectedArea] = useState('');
  const [scrappers, setScrappers] = useState<Scrapper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const findNearbyScrappers = async () => {
    if (!selectedArea) {
      setError('Please select an area');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching scrappers for:', selectedArea);
      
      const { data, error } = await supabase
        .from('scrappers')
        .select('*')
        .eq('city', selectedArea)
        .eq('available', true)
        .returns<Scrapper[]>();

      console.log('Response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No scrappers found for area:', selectedArea);
      } else {
        console.log('Found scrappers:', data.length);
      }

      setScrappers(data || []);
    } catch (err) {
      console.error('Error fetching scrappers:', err);
      setError('Failed to fetch nearby scrappers. Please try again.');
      setScrappers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedArea) {
      findNearbyScrappers();
    } else {
      setScrappers([]);
    }
  }, [selectedArea]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select your area" />
          </SelectTrigger>
          <SelectContent>
            {AREAS.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={findNearbyScrappers}
          disabled={loading || !selectedArea}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? 'Searching...' : 'Find Scrappers'}
        </Button>
      </div>

      {/* Debug Info */}
      <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
        <p>Selected Area: {selectedArea || 'None'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Scrappers found: {scrappers.length}</p>
        {error && <p className="text-red-500">Error: {error}</p>}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for scrappers...</p>
        </div>
      )}

      {/* Scrappers List */}
      <div className="space-y-4">
        {scrappers.map((scrapper) => (
          <div
            key={scrapper.id}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{scrapper.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span>{scrapper.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="font-medium">{scrapper.city}</span>
                    </p>
                    {scrapper.address && (
                      <p className="flex items-start gap-2 ml-6">
                        <span className="text-gray-500 text-sm leading-normal">
                          {scrapper.address}
                        </span>
                      </p>
                    )}
                  </div>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{scrapper.availability_hours}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>{scrapper.vehicle_type}</span>
                  </p>
                </div>

                {scrapper.scrap_types && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {scrapper.scrap_types.split(',').map((type: string) => (
                      <span
                        key={type}
                        className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                      >
                        {type.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {scrappers.length === 0 && !loading && !error && selectedArea && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg font-medium">No scrappers found in {selectedArea}</p>
            <p className="text-sm mt-2">Try selecting a different area</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyScrappers; 