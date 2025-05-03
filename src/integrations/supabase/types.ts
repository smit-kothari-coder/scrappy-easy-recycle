export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_locations: {
        Row: {
          address: string
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          summary: string | null
          type: string[]; // Define as array type

        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          summary?: string | null
          type: string[]; // Define as array type

        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          summary?: string | null
          type?: string[]; // Define as array type

        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          scrapper_id: string | null
          status: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          message: string
          scrapper_id?: string | null
          status?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          scrapper_id?: string | null
          status?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_scrapper_id_fkey"
            columns: ["scrapper_id"]
            isOneToOne: false
            referencedRelation: "scrappers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pickups: {
        Row: {
          address: string
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          pickup_time: string
          price: number | null
          scrapper_id: string | null
          status: string | null
          type: string[]
          user_id: string | null
          weight: number
        }
        Insert: {
          address: string
          created_at?: string | null
          id: string
          latitude?: number | null
          longitude?: number | null
          pickup_time: string
          price?: number | null
          scrapper_id?: string | null
          status?: string | null
          type: string
          user_id?: string | null
          weight: number
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          pickup_time?: string
          price?: number | null
          scrapper_id?: string | null
          status?: string | null
          type?: string
          user_id?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "pickups_scrapper_id_fkey"
            columns: ["scrapper_id"]
            isOneToOne: false
            referencedRelation: "scrappers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      points: {
        Row: {
          created_at: string | null
          id: string
          pickup_id: string | null
          points: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          pickup_id?: string | null
          points: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pickup_id?: string | null
          points?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_pickup_id_fkey"
            columns: ["pickup_id"]
            isOneToOne: false
            referencedRelation: "pickups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing: {
        Row: {
          id: string
          price_per_kg: number
          type: string
          updated_at: string | null
        }
        Insert: {
          id: string
          price_per_kg: number
          type: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          price_per_kg?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scrappers: {
        Row: {
          availability_hours: string | null
          available: boolean | null
          city: string
          pincode: string | null
          scrap_types: string | null
          created_at: string | null
          email: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string
          rating: number | null
          vehicle_type: string | null
        }
        Insert: {
          availability_hours?: string | null
          available?: boolean | null
          city: string
          pincode?: string | null
          created_at?: string | null
          email: string
          id: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone: string
          rating?: number | null
          vehicle_type?: string | null
        }
        Update: {
          availability_hours?: string | null
          available?: boolean | null
          city?: string
          pincode?: string | null
          created_at?: string | null
          email?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string
          rating?: number | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          pincode: string | null
          city: string
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          address?: string | null
          pincode?: string | null
          city: string
          created_at?: string | null
          email: string
          id: string
          name: string
          phone: string
        }
        Update: {
          address?: string | null
          pincode?: string | null
          city?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_price: {
        Args: { weight: number; type: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
