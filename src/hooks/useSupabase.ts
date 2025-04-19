
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Pickup, Scrapper } from '@/types';

export const useSupabase = () => {
  const getCurrentUser = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }, []);

  const getProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }, []);

  const updateProfile = useCallback(async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
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
      .select('*, profiles!pickups_user_id_fkey(*)')
      .is('scrapper_id', null)
      .eq('status', 'Requested');
    
    if (error) throw error;
    return data as (Pickup & { profiles: { name: string; phone: string } })[];
  }, []);

  const acceptPickup = useCallback(async (pickupId: string, scraperId: string) => {
    const { data, error } = await supabase
      .from('pickups')
      .update({ 
        scrapper_id: scraperId,
        status: 'Scheduled'
      })
      .eq('id', pickupId)
      .select('*, profiles!pickups_user_id_fkey(*)')
      .single();
    
    if (error) throw error;
    return data as (Pickup & { profiles: { name: string; phone: string } });
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
      .select('*, profiles!pickups_user_id_fkey(*)')
      .eq('scrapper_id', scraperId)
      .in('status', ['Scheduled', 'En Route', 'Arrived'])
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as (Pickup & { profiles: { name: string; phone: string } }) | null;
  }, []);

  return {
    getCurrentUser,
    getProfile,
    updateProfile,
    getScrapper,
    updateScrapper,
    updateScrappperLocation,
    getPickupRequests,
    acceptPickup,
    rejectPickup,
    updatePickupStatus,
    getActivePickup,
    supabase
  };
};
