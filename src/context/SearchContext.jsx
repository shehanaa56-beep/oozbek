import { createContext, useContext, useState, useEffect } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('oozbek_search_query') || '';
  });

  useEffect(() => {
    localStorage.setItem('oozbek_search_query', searchQuery);
  }, [searchQuery]);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
