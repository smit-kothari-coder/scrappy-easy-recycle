import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: 'user' | 'scrapper' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, type: 'user' | 'scrapper') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<'user' | 'scrapper' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserType(session.user.email!);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkUserType(session.user.email!);
      } else {
        setUserType(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserType = async (email: string) => {
    try {
      const { data: scrapper } = await supabase
        .from('scrappers')
        .select('id')
        .eq('email', email)
        .single();

      setUserType(scrapper ? 'scrapper' : 'user');
    } catch (error) {
      console.error('Error checking user type:', error);
      setUserType('user'); // Default to user if check fails
    }
  };

  const signUp = async (email: string, password: string, type: 'user' | 'scrapper') => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // If signing up as a scrapper, create scrapper record
        if (type === 'scrapper') {
          const { error: scrapperError } = await supabase
            .from('scrappers')
            .insert([{ 
              email: data.user.email,
              name: email.split('@')[0], // Default name from email
              city: '', // Empty city initially
              rating: 0, // Initial rating
              available: true, // Default to available
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);

          if (scrapperError) throw scrapperError;
          setUserType('scrapper');
        } else {
          setUserType('user');
        }

        toast.success('Signed up successfully! Please check your email to verify your account.');
        navigate('/signin');
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Error signing up');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is a scrapper or a regular user
      const { data: scrapper } = await supabase
        .from('scrappers')
        .select('id')
        .eq('email', email)
        .single();
          
      if (scrapper) {
        setUserType('scrapper');
        navigate('/scrapper-dashboard');
        toast.success('Signed in as scrapper');
      } else {
        setUserType('user');
        navigate('/user-dashboard');
        toast.success('Signed in successfully');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserType(null);
      navigate('/signin');
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error signing out');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    userType,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
