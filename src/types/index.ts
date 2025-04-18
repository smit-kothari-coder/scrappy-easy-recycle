
export type Scrapper = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  vehicle_type: string | null;
  availability_hours: Record<string, string>;
  latitude: number | null;
  longitude: number | null;
  available: boolean;
  rating: number;
  created_at: string;
};

export type Profile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  created_at: string;
};

export type Pickup = {
  id: string;
  user_id: string;
  scrapper_id: string | null;
  weight: number;
  type: 'Metal' | 'Paper' | 'Plastic';
  address: string;
  time_slot: string;
  date: string;
  price: number;
  status: 'Requested' | 'Scheduled' | 'En Route' | 'Arrived' | 'Completed' | 'Rejected';
  created_at: string;
  updated_at: string;
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
};

export type RedeemedReward = {
  id: string;
  user_id: string;
  reward_id: string;
  created_at: string;
};
