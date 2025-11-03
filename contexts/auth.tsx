import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
}

interface StoredUser extends User {
  password: string;
}

const AUTH_TOKEN_KEY = '@auth_token';
const USERS_KEY = '@users';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const loadStoredData = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (storedToken) {
        const usersData = await AsyncStorage.getItem(USERS_KEY);
        const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];
        
        const userId = Buffer.from(storedToken, 'base64').toString('utf-8').split(':')[0];
        const foundUser = users.find(u => u.id === userId);
        
        if (foundUser) {
          setToken(storedToken);
          setUser({
            id: foundUser.id,
            email: foundUser.email,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            gender: foundUser.gender,
          });
        }
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('Login: Attempting login for', email);
      
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        console.log('Login: User not found or password incorrect');
        return { success: false, error: 'Invalid email or password' };
      }
      
      const newToken = Buffer.from(`${foundUser.id}:${foundUser.email}`).toString('base64');
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);
      
      setToken(newToken);
      setUser({
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        gender: foundUser.gender,
      });
      
      console.log('Login: Success');
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
      console.log('Signup: Attempting signup for', data.email);
      
      const usersData = await AsyncStorage.getItem(USERS_KEY);
      const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];
      
      const existingUser = users.find(u => u.email === data.email);
      if (existingUser) {
        console.log('Signup: User already exists');
        return { success: false, error: 'User with this email already exists' };
      }
      
      const newUser: StoredUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
      };
      
      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      const newToken = Buffer.from(`${newUser.id}:${newUser.email}`).toString('base64');
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);
      
      setToken(newToken);
      setUser({
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        gender: newUser.gender,
      });
      
      console.log('Signup: Success');
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
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
