import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

interface SupabaseContextType {
  supabase: SupabaseClient<Database>;
  initialized: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        // Check if we have a session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Refresh the session if needed
          await supabase.auth.refreshSession();
        }
      } catch (error) {
        console.error('Error initializing Supabase:', error);
      } finally {
        setInitialized(true);
      }
    };

    initializeSupabase();
  }, []);

  const value = {
    supabase,
    initialized,
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}; 