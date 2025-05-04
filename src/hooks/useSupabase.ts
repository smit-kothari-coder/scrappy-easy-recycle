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
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw new Error(`Authentication error: ${error.message}`);
      return user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }, []);

  const getProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw new Error(`Profile fetch error: ${error.message}`);
      return data as Database["public"]["Tables"]["users"]["Row"];
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(
    async (
      userId: string,
      updates: Partial<Database["public"]["Tables"]["users"]["Update"]>
    ) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .update(updates)
          .eq("email", userId) // Fix: use email for updating profile
          .select()
          .single();
        if (error) throw new Error(`Profile update error: ${error.message}`);
        return data as Database["public"]["Tables"]["users"]["Row"];
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    },
    []
  );

  const getPickupRequestsForScrapper = useCallback(
    async (pincode: string) => {
      try {
        const { data, error } = await supabase
          .from("pickups")
          .select("*")
          .eq("pincode", pincode)
          .eq("status", "Requested")
          .is("scrapper_id", null);
  
        if (error) throw new Error(`Error fetching pickups: ${error.message}`);
        return data as Pickup[];
      } catch (error) {
        console.error("Error in getPickupRequestsForScrapper:", error);
        return [];
      }
    },
    []
  );
  

  const createPickupRequest = useCallback(
    async (payload: PickupRequestPayload): Promise<Pickup> => {
      const pickupId = uuidv4();
      try {
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
      } catch (error) {
        console.error("Error in createPickupRequest:", error);
        throw error;
      }
    },
    []
  );

  // Helper function to get scrapper ID by email
  const getScrapperIdByEmail = async (email: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from("scrappers")
        .select("id")
        .eq("email", email)
        .single();

      if (error) {
        console.error("Error fetching scrapper by email:", error);
        return null;
      }

      return data ? data.id : null;
    } catch (error) {
      console.error("Error fetching scrapper by email:", error);
      return null;
    }
  };

  const getScrapper = async (email: string): Promise<Scrapper | null> => {
    const scrapperId = await getScrapperIdByEmail(email); // Fetch scrapper ID by email
    if (!scrapperId) {
      console.error("Scrapper not found for email:", email);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("scrappers")
        .select("*")
        .eq("id", scrapperId) // Use scrapper ID for querying
        .single();

      if (error) {
        console.error("Error fetching scrapper:", error);
        return null;
      }

      return data as Scrapper;
    } catch (error) {
      console.error("Error fetching scrapper:", error);
      return null;
    }
  };

  const updateScrapper = useCallback(
    async (
      email: string,
      updates: Partial<Scrapper> & {
        availability_hours?: string;
        scrap_types?: string[];
        scrap_prices?: Record<string, number>;
      }
    ): Promise<{ data: Scrapper | null; error: Error | null }> => {
      const scrapperId = await getScrapperIdByEmail(email); // Get scrapper ID from email
      if (!scrapperId) {
        console.error("Error: Scrapper not found for email:", email);
        return { data: null, error: new Error("Scrapper not found") };
      }

      const formattedUpdates = {
        ...updates,
        ...(updates.scrap_prices && { scrap_prices: updates.scrap_prices }), // Ensure prices are being formatted properly
      };

      try {
        const { data, error } = await supabase
          .from("scrappers")
          .update(formattedUpdates)
          .eq("id", scrapperId) // Use scrapper ID for the update
          .select()
          .single();

        if (error) {
          console.error("Error updating scrapper:", error);
          throw new Error(`Failed to update scrapper: ${error.message}`);
        }

        return { data: data as Scrapper, error: null };
      } catch (error) {
        console.error("Error in updateScrapper:", error);
        return { data: null, error };
      }
    },
    []
  );

  const acceptPickup = useCallback(
    async (pickupId: string, scrapperId: string) => {
      try {
        const { data, error } = await supabase
          .from("pickups")
          .update({ status: "Accepted", scrapper_id: scrapperId })
          .eq("id", pickupId)
          .select()
          .single();
        if (error) throw new Error(`Accept pickup error: ${error.message}`);
        return data;
      } catch (error) {
        console.error("Error accepting pickup:", error);
        throw error;
      }
    },
    []
  );

  const rejectPickup = useCallback(async (pickupId: string) => {
    try {
      const { data, error } = await supabase
        .from("pickups")
        .update({ status: "Rejected" })
        .eq("id", pickupId)
        .select()
        .single();
      if (error) throw new Error(`Reject pickup error: ${error.message}`);
      return data;
    } catch (error) {
      console.error("Error rejecting pickup:", error);
      throw error;
    }
  }, []);

  const getActivePickup = useCallback(async (scrapperId: string) => {
    try {
      const { data, error } = await supabase
        .from("pickups")
        .select("*")
        .eq("scrapper_id", scrapperId)
        .in("status", ["Scheduled", "En Route", "Arrived"])
        .maybeSingle();

      if (error) throw new Error(`Active pickup error: ${error.message}`);
      return data;
    } catch (error) {
      console.error("Error fetching active pickup:", error);
      return null;
    }
  }, []);

  const getActiveScrappers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("scrappers")
        .select("*")
        .eq("available", true)
        .not("latitude", "is", null)
        .not("longitude", "is", null);
      if (error) throw new Error(`Active scrappers error: ${error.message}`);
      return data as Scrapper[];
    } catch (error) {
      console.error("Error fetching active scrappers:", error);
      return [];
    }
  }, []);

  const getPickupHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from('pickups')
      .select(`
        id,
        date,
        weight,
        type,
        status,
        scrappers (
          name
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });
  
    if (error) {
      throw new Error(`Error fetching pickup history: ${error.message}`);
    }
  
    return data;
  };
  
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

  const updateScrapperLocation = useCallback(
    async (id: string, lat: number, lng: number) => {
      try {
        const { data, error } = await supabase
          .from("scrappers")
          .update({ latitude: lat, longitude: lng })
          .eq("id", id)
          .select()
          .single();
        if (error) throw new Error(`Location update error: ${error.message}`);
        return data as Scrapper;
      } catch (error) {
        console.error("Error updating scrapper location:", error);
        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(`Logout error: ${error.message}`);
      return;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }, []);

  return {
    getCurrentUser,
    getProfile,
    updateProfile,
    createPickupRequest,
    getScrapper,
    updateScrapper,
    acceptPickup,
    rejectPickup,
    getActivePickup,
    getActiveScrappers,
    getPickupHistory,
    listenToPickupUpdates,
    updateScrapperLocation,
    logout,
    getPickupRequestsForScrapper,

  };
};
