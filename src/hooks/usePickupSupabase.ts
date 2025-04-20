
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Pickup } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const usePickupSupabase = () => {
  const createPickupRequest = useCallback(async (pickupData: {
    user_id: string;
    weight: number;
    address: string;
    date: string;
    time_slot: string;
    type: string[];
  }) => {
    const pickup_time = `${pickupData.date} ${pickupData.time_slot.split('(')[1].split(')')[0].split('-')[0].trim()}`;
    
    const { data, error } = await supabase
      .from('pickups')
      .insert({
        id: uuidv4(),
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

  const getPickupRequests = useCallback(async () => {
    const { data, error } = await supabase
      .from('pickups')
      .select('*, users!pickups_user_id_fkey(*)')
      .is('scrapper_id', null)
      .eq('status', 'Requested');
    
    if (error) throw error;
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
    return data as unknown as Pickup;
  }, []);

  const getActivePickup = useCallback(async (scraperId: string) => {
    const { data, error } = await supabase
      .from('pickups')
      .select('*, users!pickups_user_id_fkey(*)')
      .eq('scrapper_id', scraperId)
      .in('status', ['Scheduled', 'En Route', 'Arrived'])
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? ((data as unknown) as (Pickup & { users: { name: string; phone: string } })) : null;
  }, []);

  return {
    createPickupRequest,
    getPickupRequests,
    acceptPickup,
    rejectPickup,
    updatePickupStatus,
    getActivePickup,
  };
};
