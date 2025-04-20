
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Pickup, Scrapper, Profile } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const useSupabase = () => {
  const getCurrentUser = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }, []);

  const getProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data as Profile;
  }, []);

  const updateProfile = useCallback(async (userId: string, updates: Partial<Database['public']['Tables']['users']['Update']>) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  }, []);

  // Create a new pickup request
  const createPickupRequest = useCallback(async (pickupData: {
    user_id: string;
    weight: number;
    address: string;
    date: string;
    time_slot: string;
    type: string[];
  }) => {
    // Combine date and time_slot into pickup_time
    const pickup_time = `${pickupData.date} ${pickupData.time_slot.split('(')[1].split(')')[0].split('-')[0].trim()}`;
    
    const { data, error } = await supabase
      .from('pickups')
      .insert({
        id: uuidv4(), // Generate UUID for the pickup
        user_id: pickupData.user_id,
        weight: pickupData.weight,
        address: pickupData.address,
        pickup_time: pickup_time,
        type: pickupData.type,
        status: 'Requested'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }, []);

  // New functions for scrapper dashboard
  const getScrapper = useCallback(async (scrapperEmail: string) => {
    const { data, error } = await supabase
      .from('scrappers')
      .select('*')
      .eq('email', scrapperEmail)
      .single();
    
    if (error) throw error;
    return data as Scrapper;
  }, []);

  const updateScrapper = useCallback(async (id: string, updates: Partial<Scrapper>) => {
    const { data, error } = await supabase
      .from('scrappers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Scrapper;
  }, []);

  const updateScrappperLocation = useCallback(async (id: string, latitude: number, longitude: number) => {
    const { data, error } = await supabase
      .from('scrappers')
      .update({ latitude, longitude })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }, []);

  const getPickupRequests = useCallback(async () => {
    const { data, error } = await supabase
      .from('pickups')
      .select('*, users!pickups_user_id_fkey(*)')
      .is('scrapper_id', null)
      .eq('status', 'Requested');
    
    if (error) throw error;
    
    // Use explicit type assertion to handle the join result
    return (data as unknown) as (Pickup & { users: { name: string; phone: string } })[];
  }, []);

  const acceptPickup = useCallback(async (pickupId: string, scraperId: string) => {
    const { data, error } = await supabase
      .from('pickups')
      .update({ 
        scrapper_id: scraperId,
        status: 'Scheduled'
      })
      .eq('id', pickupId)
      .select('*, users!pickups_user_id_fkey(*)')
      .single();
    
    if (error) throw error;
    
    // Use explicit type assertion to handle the join result
    return (data as unknown) as (Pickup & { users: { name: string; phone: string } });
  }, []);

  const rejectPickup = useCallback(async (pickupId: string) => {
    const { error } = await supabase
      .from('pickups')
      .update({ status: 'Rejected' })
      .eq('id', pickupId);
    
    if (error) throw error;
    return true;
  }, []);

  const updatePickupStatus = useCallback(async (pickupId: string, status: 'En Route' | 'Arrived' | 'Completed') => {
    const { data, error } = await supabase
      .from('pickups')
      .update({ status })
      .eq('id', pickupId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Pickup;
  }, []);

  const getActivePickup = useCallback(async (scraperId: string) => {
    const { data, error } = await supabase
      .from('pickups')
      .select('*, users!pickups_user_id_fkey(*)')
      .eq('scrapper_id', scraperId)
      .in('status', ['Scheduled', 'En Route', 'Arrived'])
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    // Use explicit type assertion to handle the join result and the null case
    return data ? ((data as unknown) as (Pickup & { users: { name: string; phone: string } })) : null;
  }, []);

  // Function to logout user
  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  }, []);

  // Get all active scrappers with their locations
  const getActiveScrappers = useCallback(async () => {
    const { data, error } = await supabase
      .from('scrappers')
      .select('*')
      .eq('available', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);
    
    if (error) throw error;
    return data as Scrapper[];
  }, []);

  return {
    getCurrentUser,
    getProfile,
    updateProfile,
    createPickupRequest,
    getScrapper,
    updateScrapper,
    updateScrappperLocation,
    getPickupRequests,
    acceptPickup,
    rejectPickup,
    updatePickupStatus,
    getActivePickup,
    logout,
    getActiveScrappers,
    supabase
  };
};
