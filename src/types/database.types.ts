export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      business_locations: {
        Row: {
          id: string
          name: string
          address: string
          latitude: number
          longitude: number
          summary?: string | null
          website_url: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          latitude: number
          longitude: number
          summary?: string | null
          website_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          latitude?: number
          longitude?: number
          summary?: string | null
          website_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      scrappers: {
        Row: {
          id: string
          email: string
          name: string
          city: string
          address: string | null
          rating: number
          scrap_types: string | null
          availability_hours: string | null
          vehicle_type: string | null
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          city: string
          address?: string | null
          rating?: number
          scrap_types?: string | null
          availability_hours?: string | null
          vehicle_type?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          city?: string
          address?: string | null
          rating?: number
          scrap_types?: string | null
          availability_hours?: string | null
          vehicle_type?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 