import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login, logout, signup, subscribeToAuthChanges } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser || null);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signupUser = async (payload) => {
    const createdUser = await signup(payload);
    setUser(createdUser);
    return createdUser;
  };

  const loginUser = async (payload) => {
    const loggedInUser = await login(payload);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      authLoading,
      isAuthenticated: Boolean(user),
      signupUser,
      loginUser,
      logoutUser
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
