import { createContext, useContext } from "react";
import type { User, UserRole, SignupPayload } from "../../types";

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  demoLogin: (role?: UserRole) => Promise<User>;
  signup: (payloadOrUsername: SignupPayload | string, email?: string, password?: string) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => {
    throw new Error("AuthContext not initialized");
  },
  demoLogin: async () => {
    throw new Error("AuthContext not initialized");
  },
  signup: async () => {
    throw new Error("AuthContext not initialized");
  },
  logout: async () => {},
  updateUser: () => {},
  refreshUser: async () => {},
});

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, useAuth };
