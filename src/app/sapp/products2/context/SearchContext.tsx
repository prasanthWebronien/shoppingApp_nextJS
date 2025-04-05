"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type SearchContextType = {
  searchText: string;
  setSearchText: (text: string) => void;
  searchResults: any[];  
  setSearchResults: (results: any[]) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  return (
    <SearchContext.Provider
      value={{ searchText, setSearchText, searchResults, setSearchResults }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used inside SearchProvider");
  return context;
};
