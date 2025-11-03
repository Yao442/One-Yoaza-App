import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trpcClient } from '@/lib/trpc';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
}

const AUTH_TOKEN_KEY = '@auth_token';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const loadToken = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await trpcClient.auth.getMe.query({ token: storedToken });
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user:', error);
          await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading token:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await trpcClient.auth.login.mutate({ email, password });
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  }, []);

  const signup = useCallback(async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
  }) => {
    try {
      console.log('Signup context: sending request with data', data);
      const response = await trpcClient.auth.signup.mutate(data);
      console.log('Signup context: received response', response);
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
      setToken(response.token);
      setUser(response.user);
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Signup error details:', JSON.stringify(error, null, 2));
      return { success: false, error: error.message || 'Signup failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    token,
    login,
    signup,
    logout,
  }), [user, isLoading, token, login, signup, logout]);
});
