import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      setRole(data?.role || 'hunter');
    } catch (error) {
      setRole('hunter');
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchRole(session.user.id);
        } else {
          setUser(null);
          setRole('guest');
        }
      } catch (error) {
        setUser(null);
        setRole('guest');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchRole(session.user.id);
        } else {
          setUser(null);
          setRole('guest');
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setRole('guest');
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: updates.full_name,
          avatar_url: updates.avatar_url,
          updated_at: new Date(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      const { data, error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: updates.full_name,
          avatar_url: updates.avatar_url
        }
      });

      if (authError) throw authError;

      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);