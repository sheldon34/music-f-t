import React, { createContext, useContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
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
  groups?: string[];
  permissions?: string[];
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

const extractRoles = (payload: JwtPayload | null): string[] => {
  if (!payload) return [];
  const directRoles = Array.isArray(payload.roles) ? payload.roles : [];
  const groupRoles = Array.isArray(payload.groups) ? payload.groups : [];
  return [...directRoles, ...groupRoles].filter((r): r is string => typeof r === 'string');
};

const isAuth0Enabled = () => {
  const env = (import.meta as any).env || {};
  return Boolean(env.VITE_AUTH0_DOMAIN && env.VITE_AUTH0_CLIENT_ID);
};

const navigateToLoginRoute = () => {
  // HashRouter-friendly navigation
  window.location.hash = '#/login';
};

const computeIsAdmin = (roles: string[], isAuthenticated: boolean) => {
  if (!isAuthenticated) return false;
  return roles.some((r) => {
    const normalized = String(r).toLowerCase();
    return normalized === 'admin' || normalized === 'role_admin' || normalized === 'roles_admin';
  });
};

const AuthProviderLocal = ({ children }: { children?: ReactNode }) => {
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
    navigateToLoginRoute();
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
  const roles = useMemo(() => extractRoles(payload), [payload]);

  const isAuthenticated = !!token && !isTokenExpired(token);
  const isAdmin = computeIsAdmin(roles, isAuthenticated);

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
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthProviderAuth0 = ({ children }: { children?: ReactNode }) => {
  const env = (import.meta as any).env || {};
  const audience = env.VITE_AUTH0_AUDIENCE as string | undefined;

  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const login = useCallback(() => {
    loginWithRedirect({
      authorizationParams: audience ? { audience } : undefined,
      appState: { returnTo: window.location.hash || '#/' },
    });
  }, [audience, loginWithRedirect]);

  const loginWithCredentials = useCallback(async () => {
    await loginWithRedirect({
      authorizationParams: audience ? { audience } : undefined,
      appState: { returnTo: window.location.hash || '#/' },
    });
  }, [audience, loginWithRedirect]);

  const signup = useCallback(async () => {
    await loginWithRedirect({
      authorizationParams: {
        ...(audience ? { audience } : {}),
        screen_hint: 'signup',
      },
      appState: { returnTo: window.location.hash || '#/' },
    });
  }, [audience, loginWithRedirect]);

  const logout = useCallback(() => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin + window.location.pathname,
      },
    });
  }, [auth0Logout]);

  const getAccessToken = useCallback(async () => {
    return getAccessTokenSilently({
      authorizationParams: audience ? { audience } : undefined,
    });
  }, [audience, getAccessTokenSilently]);

  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (!isAuthenticated) {
      setRoles([]);
      return;
    }

    (async () => {
      try {
        const token = await getAccessToken();
        if (cancelled) return;
        const payload = decodeJwtPayload(token);
        setRoles(extractRoles(payload));
      } catch {
        if (cancelled) return;
        setRoles([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getAccessToken, isAuthenticated]);

  const isAdmin = computeIsAdmin(roles, isAuthenticated);
  const username =
    (auth0User as any)?.name ||
    (auth0User as any)?.email ||
    (auth0User as any)?.nickname ||
    (auth0User as any)?.sub ||
    'user';

  const user = isAuthenticated
    ? {
      username: String(username),
      roles,
      picture: typeof (auth0User as any)?.picture === 'string' ? (auth0User as any).picture : undefined,
    }
    : undefined;

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
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  if (isAuth0Enabled()) {
    return <AuthProviderAuth0>{children}</AuthProviderAuth0>;
  }
  return <AuthProviderLocal>{children}</AuthProviderLocal>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};