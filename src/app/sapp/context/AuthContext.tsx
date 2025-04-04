'use client'

import React, { createContext, useContext, ReactNode } from "react";

// Define the type for the context value
interface AuthContextType {
  refreshAccessToken: () => Promise<string | null>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Example refresh function
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      // Your token refresh logic here
      const newToken = "new_token_example";
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
