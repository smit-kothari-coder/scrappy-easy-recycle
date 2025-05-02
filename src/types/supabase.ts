// types/supabase.ts

export type Database = {
    public: {
      Tables: {
        collection_requests: {
          Row: {
            id: number;
            category: string;
            apartment_name: string;
            units: number | null;
            preferred_collection_date: string;
            scrap_types: string;
            contact_name: string;
            contact_number: string;
            residential_address: string;
            frequency: string;
            company_name: string | null;
            department: string | null;
            ewaste_types: string | null;
            quantity: number | null;
            preferred_pickup_date: string | null;
            responsible_person: string | null;
            contact_info: string | null;
            office_address: string | null;
            institution_name: string | null;
            institution_type: string | null;
            event_type: string | null;
            target_group: string | null;
            preferred_date: string | null;
            coordinator: string | null;
            contact: string | null;
            institution_address: string | null;
            created_at: string;
            status: string;
          };
          Insert: {
            category: string;
            apartment_name: string;
            units: number | null;
            preferred_collection_date: string;
            scrap_types: string;
            contact_name: string;
            contact_number: string;
            residential_address: string;
            frequency: string;
            company_name?: string | null;
            department?: string | null;
            ewaste_types?: string | null;
            quantity?: number | null;
            preferred_pickup_date?: string | null;
            responsible_person?: string | null;
            contact_info?: string | null;
            office_address?: string | null;
            institution_name?: string | null;
            institution_type?: string | null;
            event_type?: string | null;
            target_group?: string | null;
            preferred_date?: string | null;
            coordinator?: string | null;
            contact?: string | null;
            institution_address?: string | null;
            created_at: string;
            status: string;
          };
          Update: Partial<
            Omit<
              Database['public']['Tables']['collection_requests']['Row'],
              "id" | "created_at"
            >
          >;
        };
      };
    };
  };
  