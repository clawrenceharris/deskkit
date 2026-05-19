import { useCallback, useState } from "react";
import {
  addRecentSearch,
  getRecentSearches,
  saveRecentSearches,
  type RecentSearch,
} from "@/features/search/infrastructure/recentSearchesStorage";

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() =>
    getRecentSearches(),
  );

  const recordRecentSearch = useCallback((search: Omit<RecentSearch, "id">) => {
    setRecentSearches((current) => {
      const next = addRecentSearch(current, search);
      saveRecentSearches(next);
      return next;
    });
  }, []);

  return {
    recentSearches,
    recordRecentSearch,
  };
}
