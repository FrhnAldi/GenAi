import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types/auth';
import { DEMO_USERS } from '../data/users';

const STORAGE_KEY = 'rasanusa_auth_v1';

interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, [user]);

  const login = (username: string, password: string) => {
    const match = DEMO_USERS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!match) {
      return { ok: false, error: 'Username atau password salah.' };
    }
    setUser({ username: match.username, name: match.name, role: match.role });
    return { ok: true };
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
