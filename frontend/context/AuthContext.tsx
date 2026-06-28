"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { loginUser, registerUser, getCurrentUser } from "@/lib/auth";
import type { User, LoginPayload, RegisterPayload } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, check for an existing token and validate it against
  // the backend. If it's invalid/expired, clear it instead of trusting it.
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem("token");

      try {
        if (storedToken) {
          const res = await getCurrentUser();
          setUser(res.user);
        }
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(data: LoginPayload) {
    const res = await loginUser(data);
    localStorage.setItem("token", res.token);
    setUser(res.user);
  }

  async function register(data: RegisterPayload) {
    await registerUser(data);
    // No token returned on register — user still needs to log in.
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}