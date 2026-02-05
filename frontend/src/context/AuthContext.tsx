import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshUser = useCallback(async () => {
    if (isRefreshing) return; // Prevent concurrent refresh calls

    setIsRefreshing(true);
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.data.user);
    } catch (error) {
      setUser(null);
      console.error("Failed to refresh user:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  useEffect(() => {
    const init = async () => {
      console.log("Auth provider initializing");
      await refreshUser();
      setLoading(false);
    };

    init();
  }, [refreshUser]);

  const location = useLocation();

  useEffect(() => {
    // Only refresh on route change if we don't have a user AND we're not already refreshing
    if (!loading && !user && !isRefreshing) {
      refreshUser();
    }
  }, [location.pathname, loading, user, isRefreshing, refreshUser]);

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
