
import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any, isScrapperSignUp: boolean) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  userType: 'user' | 'scrapper' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'user' | 'scrapper' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Determine user type after a short delay to avoid potential deadlocks
        if (session?.user) {
          setTimeout(async () => {
            try {
              // Check if user is a scrapper
              const { data: scrapper } = await supabase
                .from('scrappers')
                .select('id')
                .eq('email', session.user.email)
                .single();
                
              if (scrapper) {
                setUserType('scrapper');
              } else {
                setUserType('user');
              }
            } catch (error) {
              console.error('Error determining user type:', error);
              setUserType('user'); // Default to user if error
            }
          }, 0);
        } else {
          setUserType(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Determine user type
      if (session?.user) {
        setTimeout(async () => {
          try {
            // Check if user is a scrapper
            const { data: scrapper } = await supabase
              .from('scrappers')
              .select('id')
              .eq('email', session.user.email)
              .single();
              
            if (scrapper) {
              setUserType('scrapper');
            } else {
              setUserType('user');
            }
          } catch (error) {
            console.error('Error determining user type:', error);
            setUserType('user'); // Default to user if error
          }
        }, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    userData: any, 
    isScrapperSignUp: boolean
  ) => {
    try {
      setLoading(true);
      
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      if (!data.user) {
        throw new Error('User was not created');
      }
      
      // Insert user data into the appropriate table
      if (isScrapperSignUp) {
        let aadharUrl = null;
        let panUrl = null;
      
        if (userData.aadharImage && userData.panImage) {
          const userId = data.user.id;
      
          // Upload Aadhar
          const { data: aadharUpload, error: aadharError } = await supabase.storage
            .from('kyc-docs')
            .upload(`aadhar/${userId}.jpg`, userData.aadharImage, {
              cacheControl: '3600',
              upsert: true,
            });
      
          if (aadharError) throw aadharError;
      
          const { data: aadharPublic } = supabase
            .storage
            .from('kyc-docs')
            .getPublicUrl(aadharUpload.path);
          aadharUrl = aadharPublic.publicUrl;
      
          // Upload PAN
          const { data: panUpload, error: panError } = await supabase.storage
            .from('kyc-docs')
            .upload(`pan/${userId}.jpg`, userData.panImage, {
              cacheControl: '3600',
              upsert: true,
            });
      
          if (panError) throw panError;
      
          const { data: panPublic } = supabase
            .storage
            .from('kyc-docs')
            .getPublicUrl(panUpload.path);
          panUrl = panPublic.publicUrl;
        }
      
        // Insert scrapper data WITHOUT latitude and longitude
        const { error: insertError } = await supabase
          .from('scrappers')
          .insert({
            id: data.user.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            city: userData.city,
            vehicle_type: userData.vehicleType,
            availability_hours: userData.workingHours,
            available: true,
            rating: 0,
            aadhar_url: aadharUrl,
            pan_url: panUrl,
            aadhar_number: userData.aadharNumber,
            pan_number: userData.panNumber
          });
      
        if (insertError) throw insertError;
      
        setUserType('scrapper');
        toast.success('Scrapper account created with KYC!');
        navigate('/scrapper-dashboard');
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
      
      // Check if the user is a scrapper or a regular user
      try {
        // Check if user is a scrapper
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
      } catch (error) {
        console.error('Error determining user type:', error);
        // Default to user dashboard
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        userType
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
