// src/hooks/useSupabase.ts

import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import type { Database } from "@/integrations/supabase/types";
import { Pickup, Scrapper } from "@/types";

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
  const getCurrentUser = useCallback(async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw new Error(`Authentication error: ${error.message}`);
    return user;
  }, []);

  const getProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw new Error(`Profile fetch error: ${error.message}`);
    return data as Database["public"]["Tables"]["users"]["Row"];
  }, []);

  const updateProfile = useCallback(
    async (
      userId: string,
      updates: Partial<Database["public"]["Tables"]["users"]["Update"]>
    ) => {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("email", userId)
        .select()
        .single();
      if (error) throw new Error(`Profile update error: ${error.message}`);
      return data as Database["public"]["Tables"]["users"]["Row"];
    },
    []
  );

  const createPickupRequest = useCallback(
    async (payload: PickupRequestPayload): Promise<Pickup> => {
      const pickupId = uuidv4();
      const { data, error } = await supabase
        .from("pickups")
        .insert({
          id: pickupId,
          user_id: payload.user_id,
          scrapper_id: payload.scrapper_id ?? null,
          weight: payload.weight,
          type: payload.type.toString(),
          address: payload.address,
          price: payload.price ?? 0,
          status: "Requested",
          created_at: new Date().toISOString(),
          latitude: payload.latitude,
          longitude: payload.longitude,
          pickup_time: new Date().toISOString(),
          time_slot: `${payload.time_slot.start} - ${payload.time_slot.end}`,
          pincode: payload.pincode,
          date: payload.date,
        })
        .select()
        .single();

      if (error) throw new Error(`Pickup creation error: ${error.message}`);

      const pincodeNumber = parseInt(payload.pincode, 10);
      if (isNaN(pincodeNumber)) {
        throw new Error("Invalid pincode");
      }

      const { data: scrappers, error: scrappersError } = await supabase
        .from("scrappers")
        .select("*")
        .eq("available", true)
        .eq("pincode", pincodeNumber);

      if (scrappersError) {
        console.error("Error fetching scrappers for pickup:", scrappersError);
        throw new Error(`Scrappers fetch error: ${scrappersError.message}`);
      }

      return {
        ...data,
        date: payload.date,
        time_slot: `${payload.time_slot.start} - ${payload.time_slot.end}`,
        scrappers,
      } as Pickup;
    },
    []
  );

  const getScrapper = async (email) => {
    try {
      const { data, error } = await supabase
        .from("scrappers") // or whatever your table name is
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in getScrapper:", error);
      return null; // Ensure null is returned if there's an error
    }
  };

  const updatePickupStatus = useCallback(
    async (pickupId: string, status: string) => {
      const { data, error } = await supabase
        .from("pickups")
        .update({ status })
        .eq("id", pickupId)
        .select()
        .single();

      if (error)
        throw new Error(`Update pickup status error: ${error.message}`);
      return data;
    },
    []
  );

  const getPickupHistory = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("pickups")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error)
      throw new Error(`Error fetching pickup history: ${error.message}`);
    return data;
  }, []);

  const listenToPickupUpdates = useCallback(
    (userId: string, callback: (data: Pickup) => void) => {
      const channel = supabase
        .channel(`pickups:user_id=eq.${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "pickups",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("New pickup added:", payload.new);
            callback(payload.new as Pickup);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "pickups",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("Pickup updated:", payload.new);
            callback(payload.new as Pickup);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "pickups",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("Pickup deleted:", payload.old);
            callback(payload.old as Pickup);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
    []
  );

  const updateScrapper = useCallback(
    async (
      id: string,
      updates: Partial<Scrapper> & {
        availability_hours?: string;
        scrap_types?: string[];
      }
    ) => {
      const formattedUpdates = {
        ...updates,
        ...(updates.scrap_types && {
          scrap_types: updates.scrap_types, // pass as array directly
        }),
      };
      console.log("Updating scrapper ID:", id);
      console.log("With updates:", formattedUpdates);

      const { data, error } = await supabase
        .from("scrappers")
        .update(formattedUpdates)
        .eq("id", id) // confirm 'id' column exists and matches this type
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        throw new Error(`Scrapper update error: ${error.message}`);
      }

      return data as Scrapper;
    },
    []
  );

  const acceptPickup = useCallback(
    async (pickupId: string, scrapperId: string) => {
      const { data, error } = await supabase
        .from("pickups")
        .update({ status: "Accepted", scrapper_id: scrapperId })
        .eq("id", pickupId)
        .select()
        .single();
      if (error) throw new Error(`Accept pickup error: ${error.message}`);
      return data;
    },
    []
  );

  const rejectPickup = useCallback(async (pickupId: string) => {
    const { data, error } = await supabase
      .from("pickups")
      .update({ status: "Rejected" })
      .eq("id", pickupId)
      .select()
      .single();
    if (error) throw new Error(`Reject pickup error: ${error.message}`);
    return data;
  }, []);

  const updateScrapperLocation = useCallback(
    async (id: string, lat: number, lng: number) => {
      const { data, error } = await supabase
        .from("scrappers")
        .update({ latitude: lat, longitude: lng })
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(`Location update error: ${error.message}`);
      return data as Scrapper;
    },
    []
  );

  const getActivePickup = useCallback(async (scrapperId: string) => {
    const { data, error } = await supabase
      .from("pickups")
      .select("*")
      .eq("scrapper_id", scrapperId)
      .in("status", ["Scheduled", "En Route", "Arrived"])
      .maybeSingle();
    if (error) throw new Error(`Active pickup error: ${error.message}`);
    return data;
  }, []);

  const getActiveScrappers = useCallback(async () => {
    const { data, error } = await supabase
      .from("scrappers")
      .select("*")
      .eq("available", true)
      .not("latitude", "is", null)
      .not("longitude", "is", null);
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
    getPickupRequests: async () => {
      const { data, error } = await supabase.from("pickups").select("*");
      if (error)
        throw new Error(`Error fetching pickup requests: ${error.message}`);
      return data as Pickup[];
    },
    acceptPickup,
    rejectPickup,
    updateScrapper,
    updateScrapperLocation,
    getActivePickup,
    getActiveScrappers,
    logout,
    getPickupHistory,
    listenToPickupUpdates,
    getScrapper,
  };
};
//
