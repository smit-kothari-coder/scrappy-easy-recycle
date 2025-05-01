// types/index.ts

export type Profile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  created_at: string;
  scrapType?: string[];      // Added
  scrapKg?: number;          // Added
  totalPoints?: number;      // Added
};

export type Points = {
  id: string;
  user_id: string;
  pickup_id: string;
  points: number;
  created_at: string;
};

export type Reward = {
  id: string;
  name: string;
  description: string | null;
  points_required: number;
  active: boolean;
  image_url?: string;        // Added
  created_at?: string;       // Added
};

export type RedeemedReward = {
  id: string;
  user_id: string;
  reward_id: string;
  created_at: string;
  status?: 'Pending' | 'Completed' | 'Cancelled';  // Added
};

export type Scrapper = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  vehicle_type: string | null;
  availability_hours: string | null;
  latitude: number | null;
  longitude: number | null;
  available: boolean;
  rating: number;
  created_at: string;
  scrap_types: string[];     // Changed to always be array
  average_rating?: number;   // Added
  profile_image?: string;    // Added
  registration_number: string | null; // Add vehicle_number field
  scrap_prices?: { [key: string]: number
   }; // Added scrap_prices property


};

export type Pickup = {
  id: string;
  user_id: string;
  scrapper_id: string | null;
  weight: number;
  type: string[];
  address: string;
  date: string;
  time_slot: string;
  price: number | null;
  status: 'Requested' | 'Scheduled' | 'En Route' | 'Arrived' | 'Completed' | 'Rejected';
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at?: string;
  points_awarded?: number;   // Added
  rating?: number;           // Added
  feedback?: string;         // Added
  payment_status?: 'Pending' | 'Completed' | 'Failed';  // Added
};

export type BusinessLocation = {
  id: string;
  name: string;
  address: string;
  summary: string | null;
  latitude: number;
  longitude: number;
  created_at?: string;
  operating_hours?: string;  // Added
  contact_number?: string;   // Added
  accepted_materials?: string[];  // Added
};

// Added new types

export type User = {
  id: string;
  email: string;
  name: string | null;
  scrapType: string[];
  scrapKg: number;
  totalPoints: number;
  created_at: string;
  updated_at?: string;
  profile_image?: string;
  phone?: string;
  address?: string;
  city?: string;
};

export type ScrapMaterial = {
  id: string;
  name: string;
  price_per_kg: number;
  description?: string;
  category?: string;
  image_url?: string;
  is_active: boolean;
};

export type PickupTimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  max_pickups?: number;
};

export type PaymentTransaction = {
  id: string;
  pickup_id: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  payment_method?: string;
  transaction_id?: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'pickup' | 'reward' | 'payment' | 'system';
  read: boolean;
  created_at: string;
  action_url?: string;
};

// Added type guards
export const isUser = (user: any): user is User => {
  return user 
    && typeof user.id === 'string'
    && typeof user.email === 'string'
    && Array.isArray(user.scrapType)
    && typeof user.scrapKg === 'number';
};

export const isPickup = (pickup: any): pickup is Pickup => {
  return pickup
    && typeof pickup.id === 'string'
    && typeof pickup.user_id === 'string'
    && Array.isArray(pickup.type)
    && typeof pickup.weight === 'number';
};

export const isScrapper = (scrapper: any): scrapper is Scrapper => {
  return scrapper
    && typeof scrapper.id === 'string'
    && typeof scrapper.name === 'string'
    && typeof scrapper.email === 'string'
    && Array.isArray(scrapper.scrap_types);
};

export interface AppUser {
  id: string;
  name: string;
  email: string;
  scrapKg: number;
  scrapType: ScrapType[];
};

export type ScrapType = 'paper' | 'plastic' | 'metal' | 'glass' | 'rubber' | 'textiles' | 'organic' | 'eWaste';

