// hooks/useAuth.ts
import { useCallback, useState } from "react";
import { authService } from "~/services/authService";

export interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  birthDate?: string;
  address?: string;
  id_photo_path?: string | null;
  profile?: string | null;
  role_id?: number;
  role?: { id?: number; role_type?: string } | string;
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(email, password);
      const token = res.token!;
      const userFromApi = res.user ?? null;

      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, token);
        if (userFromApi) {
          localStorage.setItem(USER_KEY, JSON.stringify(userFromApi));
        }
      }

      setUser(userFromApi);
      return userFromApi;
    } catch (err: any) {
      const msg = err?.message || "Login failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (token) {
        try {
          await authService.logout(token);
        } catch (e) {
          console.warn("logout (server) failed:", e);
        }
      }
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
      setUser(null);
      setLoading(false);
    }
  }, [getToken]);

  const isAuthenticated = Boolean(getToken());

  return {
    user,
    loading,
    error,
    login,
    logout,
    getToken,
    isAuthenticated,
  };
}

export default useAuth;
