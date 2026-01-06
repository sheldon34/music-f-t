import React, { createContext, useContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthService } from '../services/api';

interface AuthContextType {
  user: { username: string; roles: string[]; picture?: string } | undefined;
  login: () => void;
  loginWithCredentials: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  getAccessToken: () => Promise<string>;
  isAdmin: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'dj_pimpim_access_token';

type JwtPayload = {
  sub?: string;
  exp?: number;
  roles?: string[];
};

const decodeBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return atob(padded);
};

const decodeJwtPayload = (token: string): JwtPayload | null => {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const json = decodeBase64Url(parts[1]);
    const payload = JSON.parse(json) as JwtPayload;
    return payload;
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSeconds;
};

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored && !isTokenExpired(stored)) {
      setToken(stored);
    } else if (stored) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  }, []);

  const login = useCallback(() => {
    // HashRouter-friendly navigation
    window.location.hash = '#/login';
  }, []);

  const loginWithCredentials = useCallback(async (username: string, password: string) => {
    const accessToken = await AuthService.login(username, password);
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    setToken(accessToken);
  }, []);

  const signup = useCallback(async (username: string, password: string) => {
    await AuthService.register(username, password);
  }, []);

  const getAccessToken = useCallback(async () => {
    if (!token) throw new Error('Not authenticated');
    if (isTokenExpired(token)) {
      logout();
      throw new Error('Session expired');
    }
    return token;
  }, [logout, token]);

  const payload = useMemo(() => (token ? decodeJwtPayload(token) : null), [token]);
  const roles = useMemo(() => {
    const list = payload?.roles;
    return Array.isArray(list) ? list.filter((r): r is string => typeof r === 'string') : [];
  }, [payload]);

  const isAuthenticated = !!token && !isTokenExpired(token);
  const isAdmin = isAuthenticated && roles.some((r) => {
    const normalized = r.toLowerCase();
    return normalized === 'admin' || normalized === 'role_admin';
  });

  const user = isAuthenticated && payload?.sub ? { username: payload.sub, roles } : undefined;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginWithCredentials,
      signup,
      logout,
      isAuthenticated,
      isLoading,
      getAccessToken,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};