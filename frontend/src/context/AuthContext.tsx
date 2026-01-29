import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log("Auth refresh called");
      await refreshUser();
      setLoading(false);
    };

    init();
  }, []);

  const location = useLocation();

  useEffect(() => {
    // If route changes and we don't have a user yet, try to refresh.
    if (!loading && !user) {
      refreshUser();
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
