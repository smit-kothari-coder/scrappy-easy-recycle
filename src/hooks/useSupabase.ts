// src/hooks/useSupabase.ts

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import type { Database } from '@/integrations/supabase/types';
import { Pickup, Scrapper } from '@/types';
// import { getLatLongFromAddress } from '@/components/SchedulePickup';


type PickupRequestPayload = {
  user_id: string;
  weight: number;
  address: string;
  date: string;
  time_slot: { start: string; end: string };
  type: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  scrapper_id?: string;
};

export const useSupabase = () => {
  // User management
  const getCurrentUser = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error(`Authentication error: ${error.message}`);
    return user;
  }, []);

  const getProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', userId)
      .single();
    if (error) throw new Error(`Profile fetch error: ${error.message}`);
    return data as Database['public']['Tables']['users']['Row'];
  }, []);

  const updateProfile = useCallback(async (userId: string, updates: Partial<Database['public']['Tables']['users']['Update']>) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('email', userId)
      .select()
      .single();
    if (error) throw new Error(`Profile update error: ${error.message}`);
    return data as Database['public']['Tables']['users']['Row'];
  }, []);

  // Pickup management
  const createPickupRequest = useCallback(async (payload: PickupRequestPayload) => {
    const pickupId = uuidv4();

    // const { latitude, longitude } = await getLatLongFromAddress(payload.address);

    console.log('Creating pickup request with type:', payload.type);
    const { data, error } = await supabase
      .from('pickups')
      .insert({
        id: pickupId,
        user_id: payload.user_id,
        scrapper_id: payload.scrapper_id ?? null,
        weight: payload.weight,
        type: payload.type.toString(),
        address: payload.address,
        price: payload.price ?? 0,
        status: 'Requested',
        created_at: new Date().toISOString(),
        latitude: payload.latitude,
        longitude: payload.longitude,
        pickup_time: new Date().toISOString(),
        time_slot: `${payload.time_slot.start} - ${payload.time_slot.end}`,
        pincode: payload.pincode,
        date: payload.date,
      })
      .select()
      .single() as { data: Pickup | null; error: any };

    if (error) throw new Error(`Pickup creation error: ${error.message}`);
    // Now we fetch scrappers based on the pincode of the pickup

    const pincodeNumber = parseInt(payload.pincode, 10);
    if (isNaN(pincodeNumber)) {
      throw new Error('Invalid pincode');
    }

    const { data: scrappers, error: scrappersError } = await supabase
      .from('scrappers')
      .select('*')
      .eq('available', true)
      .eq('pincode', pincodeNumber); // Match scrappers by pincode

    if (scrappersError) {
      console.error('Error fetching scrappers for pickup:', scrappersError);
    }

    // If scrappers are found, send a notification or handle requests
    if (scrappers && scrappers.length > 0) {
      console.log('Found scrappers in the same area:', scrappers);
      // Optional: Insert into a 'pickup_requests' table or send notification
      // This is where you would notify or update scrappers with the new pickup request
    }

    return {
      ...data,
      date: payload.date,
      time_slot: `${payload.time_slot.start} - ${payload.time_slot.end}`,
      scrappers
    } as Pickup;
  }, []);
  const updatePickupStatus = useCallback(async (pickupId: string, status: string) => {
    const { data, error } = await supabase
      .from('pickups')
      .update({ status })
      .eq('id', pickupId)
      .select()
      .single();

    if (error) throw new Error(`Update pickup status error: ${error.message}`);
    return data;
  }, []);

  const getPickupRequests = useCallback(async (scrapperPincode: string) => {
    const { data, error } = await supabase
      .from('pickups')
      .select('*')
      .is('user_id', null)
      .eq('status', 'Requested')
     .eq('pincode', scrapperPincode); // 👈 Only pickups in same pincode

    if (error) throw new Error(`Pickup requests error: ${error.message}`);
    return data;
  }, []);

  const acceptPickup = useCallback(async (pickupId: string, scrapperId: string) => {
    const { data, error } = await supabase
      .from('pickups')
      .update({
        scrapper_id: scrapperId,
        status: 'Scheduled',
      })
      .eq('id', pickupId)
      .select(`
        id,
        user_id,
        users:user_id (name, phone)
      `)
      .single();
    if (error) throw new Error(`Accept pickup error: ${error.message}`);
    if (!data || !data.users || !Array.isArray(data.users) || data.users.length === 0) {
      throw new Error('Invalid data structure: users field is missing or empty');
    }
    return {
      ...data,
      users: data.users[0],
    } as Pickup & { users: { name: string; phone: string } };
  }, []);

  const rejectPickup = useCallback(async (pickupId: string) => {
    const { error } = await supabase
      .from('pickups')
      .update({ status: 'Rejected' })
      .eq('id', pickupId);
    if (error) throw new Error(`Reject pickup error: ${error.message}`);
    return true;
  }, []);

  // Scrapper management
  const updateScrapper = useCallback(async (id: string, updates: Partial<Scrapper> & { availability_hours?: string; scrap_types?: string[] }) => {
    const formattedUpdates = {
      ...updates,
      ...(updates.scrap_types && { scrap_types: updates.scrap_types.join(', ') }),
    };
    const { data, error } = await supabase
      .from('scrappers')
      .update(formattedUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Scrapper update error: ${error.message}`);
    return data as Scrapper;
  }, []);

  const updateScrapperLocation = useCallback(async (id: string, lat: number, lng: number) => {
    const { data, error } = await supabase
      .from('scrappers')
      .update({ latitude: lat, longitude: lng })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Location update error: ${error.message}`);
    return data as Scrapper;
  }, []);

  // Utilities
  const getActivePickup = useCallback(async (scrapperId: string) => {
    const { data, error } = await supabase
      .from('pickups')
      .select('*')
      .eq('scrapper_id', scrapperId)
      .in('status', ['Scheduled', 'En Route', 'Arrived'])
      .maybeSingle();
    if (error) throw new Error(`Active pickup error: ${error.message}`);
    return data;
  }, []);

  const getActiveScrappers = useCallback(async () => {
    const { data, error } = await supabase
      .from('scrappers')
      .select('*')
      .eq('available', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);
    if (error) throw new Error(`Active scrappers error: ${error.message}`);
    return data as Scrapper[];
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`Logout error: ${error.message}`);
    return true;
  }, []);

  return {
    getCurrentUser,
    getProfile,
    updateProfile,
    createPickupRequest,
    getPickupRequests,
    acceptPickup,
    rejectPickup,
    updateScrapper,
    updateScrapperLocation,
    getActivePickup,
    getActiveScrappers,
    logout,
  };
};
