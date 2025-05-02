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
  signIn: (emailOrPhone: string, passwordOrOtp: string, isPhoneLogin: boolean) => Promise<void>;
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(async () => {
            try {
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
              setUserType('user');
            }
          }, 0);
        } else {
          setUserType(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(async () => {
          try {
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
            setUserType('user');
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

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('User was not created');

      if (isScrapperSignUp) {
        const { error: insertError } = await supabase
          .from('scrappers')
          .insert({
            id: data.user.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            city: userData.city,
            pincode: userData.pincode,
            vehicle_type: userData.vehicleType,
            registration_number: userData.registrationNumber,
            availability_hours: userData.workingHours,
            service_area: userData.serviceArea,
            scrap_types: userData.scrapTypes,
            available: true,
            rating: 0
          });

        if (insertError) throw insertError;

        setUserType('scrapper');
        toast.success('Scrapper account created!');
        navigate('/scrapper-dashboard');
      }

    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Error signing up');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (emailOrPhone: string, passwordOrOtp: string, isPhoneLogin: boolean) => {
    try {
      setLoading(true);

      if (isPhoneLogin) {
        // Handle phone login (OTP)
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: emailOrPhone,
        });

        if (error) throw error;
        toast.success('OTP sent successfully');
        return;
      } else {
        // Handle email login (password)
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrPhone,
          password: passwordOrOtp,
        });

        if (error) throw error;

        try {
          const { data: scrapper } = await supabase
            .from('scrappers')
            .select('id')
            .eq('email', emailOrPhone)
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
          setUserType('user');
          navigate('/user-dashboard');
          toast.success('Signed in successfully');
        }
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
