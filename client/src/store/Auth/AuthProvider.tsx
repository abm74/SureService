import { useCallback, useEffect, useReducer, useRef } from "react";
import { AuthContext } from "./AuthContext";
import type { User, UserRole, SignupPayload } from "../../types";
import api from "../../services/api";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
};

type AuthAction =
  | { type: "setUser"; payload: User }
  | { type: "patchUser"; payload: Partial<User> }
  | { type: "logout" }
  | { type: "setLoading"; payload: boolean };

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "setUser":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
      };
    case "patchUser":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "logout":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
      };
    case "setLoading":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  const authMutationInProgress = useRef(false);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get<{ user: User }>("/auth/me");
      dispatch({ type: "setUser", payload: res.data.user });
    } catch {
      dispatch({ type: "logout" });
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get<{ user: User }>("/auth/me");
        if (!authMutationInProgress.current) {
          dispatch({ type: "setUser", payload: res.data.user });
        }
      } catch {
        if (!authMutationInProgress.current) {
          dispatch({ type: "logout" });
        }
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    authMutationInProgress.current = true;
    dispatch({ type: "setLoading", payload: true });
    try {
      const res = await api.post<{ user: User }>("/auth/login", { email, password });
      dispatch({ type: "setUser", payload: res.data.user });
    } catch (error) {
      dispatch({ type: "logout" });
      throw error;
    } finally {
      authMutationInProgress.current = false;
    }
  }, []);

  const demoLogin = useCallback(async (role: UserRole = "customer") => {
    authMutationInProgress.current = true;
    dispatch({ type: "setLoading", payload: true });
    try {
      const res = await api.post<{ user: User }>("/auth/demo-login", { role });
      dispatch({ type: "setUser", payload: res.data.user });
    } catch (error) {
      dispatch({ type: "logout" });
      throw error;
    } finally {
      authMutationInProgress.current = false;
    }
  }, []);

  const signup = useCallback(
    async (payloadOrUsername: SignupPayload | string, email?: string, password?: string) => {
      authMutationInProgress.current = true;
      dispatch({ type: "setLoading", payload: true });
      try {
        const payload: SignupPayload =
          typeof payloadOrUsername === "string"
            ? { username: payloadOrUsername, email: email || "", password: password || "" }
            : payloadOrUsername;

        const res = await api.post<{ user: User }>("/auth/signup", payload);
        dispatch({ type: "setUser", payload: res.data.user });
      } catch (error) {
        dispatch({ type: "logout" });
        throw error;
      } finally {
        authMutationInProgress.current = false;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Clear session even if network call fails
    }
    dispatch({ type: "logout" });
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    dispatch({ type: "patchUser", payload: userData });
  }, []);

  const authContextValue = {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    login,
    demoLogin,
    signup,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext value={authContextValue}>{children}</AuthContext>;
};

export default AuthProvider;
