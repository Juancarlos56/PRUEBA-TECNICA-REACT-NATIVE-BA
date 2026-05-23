import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from '../types';
import { loginService, getMeService } from '../services/auth.service';
import { ALLOWED_CREDENTIALS, STORAGE_KEYS } from '../constants';

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (username: string, password: string, remember: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!accessToken;

  const login = async (
    username: string,
    password: string,
    remember: boolean
  ): Promise<boolean> => {
    setAuthError(null);

    if (
      username.trim() !== ALLOWED_CREDENTIALS.username ||
      password !== ALLOWED_CREDENTIALS.password
    ) {
      setAuthError('Credenciales inválidas');
      return false;
    }

    try {
      const data = await loginService(username, password);

      if (remember) {
        await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
      }

      setUser(data);
      setAccessToken(data.accessToken);
      return true;
    } catch (e) {
      setAuthError('Error al conectar con el servidor');
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    setAuthError(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  };

  const restoreSession = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (token && userStr) {
        const freshUser = await getMeService(token);
        setUser(freshUser);
        setAccessToken(token);
      }
    } catch {
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        authError,
        login,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
