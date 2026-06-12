import { createContext, useContext } from "react";
import type { User, UserRole, SignupPayload } from "../../types";

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: (role?: UserRole) => Promise<void>;
  signup: (payloadOrUsername: SignupPayload | string, email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: async () => {},
  demoLogin: async () => {},
  signup: async () => {},
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
