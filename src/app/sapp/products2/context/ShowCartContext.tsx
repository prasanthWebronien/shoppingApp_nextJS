"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface ShowCartContextType {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

// Create the context with an initial undefined value
const ShowCartContext = createContext<ShowCartContextType | undefined>(undefined);

// Custom hook to use the context
export const useShowCart = () => {
  const context = useContext(ShowCartContext);
  if (!context) {
    throw new Error("useShowCart must be used within a ShowCartProvider");
  }
  return context;
};

// Provider component
export const ShowCartProvider = ({ children }: { children: ReactNode }) => {
  const [showCart, setShowCart] = useState(false);

  return (
    <ShowCartContext.Provider value={{ showCart, setShowCart }}>
      {children}
    </ShowCartContext.Provider>
  );
};
