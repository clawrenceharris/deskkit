const RECENT_SEARCHES_KEY = "edesk:global-search:recent";
const MAX_RECENT_SEARCHES = 8;

export type RecentSearch = {
  id: string;
  query: string;
  label: string;
};

function normalizeRecentQuery(query: string) {
  return query.trim().toLowerCase();
}

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function getRecentSearches(): RecentSearch[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (entry): entry is RecentSearch =>
        typeof entry?.id === "string" &&
        typeof entry?.query === "string" &&
        typeof entry?.label === "string",
    );
  } catch {
    return [];
  }
}

export function saveRecentSearches(searches: RecentSearch[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
}

export function addRecentSearch(
  searches: RecentSearch[],
  search: Omit<RecentSearch, "id">,
) {
  const normalizedQuery = normalizeRecentQuery(search.query);
  if (!normalizedQuery) return searches;

  const nextSearch = {
    ...search,
    id: `${normalizedQuery}:${Date.now()}`,
  };

  return [
    nextSearch,
    ...searches.filter(
      (entry) => normalizeRecentQuery(entry.query) !== normalizedQuery,
    ),
  ].slice(0, MAX_RECENT_SEARCHES);
}

export function clearRecentSearches() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(RECENT_SEARCHES_KEY);
}
