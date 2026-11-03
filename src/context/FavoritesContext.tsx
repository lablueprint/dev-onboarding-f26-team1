import { createContext, useContext } from 'react';

type FavoritesContextValue = {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // TODO(Max, Sprint 2): replace these stubs with real state + AsyncStorage
  const value: FavoritesContextValue = {
    favoriteIds: [],
    isFavorite: () => false,
    toggleFavorite: () => {},
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }
  return ctx;
}
