import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface UserTenant {
  tenant_id: string;
  tenant_name: string;
  tenant_slug: string;
  tenant_status: string;
  provisioning_status: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  tenant: UserTenant | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tenant, setTenant] = useState<UserTenant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching profile:', profileError);
        }
        return;
      }

      setProfile(profileData);

      // Fetch tenant information
      const { data: tenantData, error: tenantError } = await supabase
        .rpc('get_user_tenant', { p_user_id: userId });

      if (tenantError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching tenant:', tenantError);
        }
        return;
      }

      if (tenantData && tenantData.length > 0) {
        setTenant(tenantData[0]);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error in fetchProfile:', error);
      }
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer profile fetching to avoid auth state deadlock
          setTimeout(() => {
            if (isMounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
          setTenant(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          if (isMounted) {
            fetchProfile(session.user.id);
          }
        }, 0);
      }
      
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Enhanced validation
      if (!email || !password || !firstName || !lastName) {
        return { error: { message: 'All fields are required' } };
      }

      if (password.length < 8) {
        return { error: { message: 'Password must be at least 8 characters long' } };
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      const redirectUrl = `${window.location.origin}/admin/dashboard`;
      
      const { error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim()
          }
        }
      });

      return { error };
    } catch (error) {
      return { error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Enhanced validation
      if (!email || !password) {
        return { error: { message: 'Email and password are required' } };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      return { error };
    } catch (error) {
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setTenant(null);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error signing out:', error);
      }
    }
  }, []);

  const value = {
    user,
    session,
    profile,
    tenant,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};