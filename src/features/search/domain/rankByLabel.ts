export function normalizeSearchText(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function scoreLabel(label: string, query: string) {
  const normalizedLabel = normalizeSearchText(label);
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) return 0;
  if (normalizedLabel === normalizedQuery) return 0;
  if (normalizedLabel.startsWith(normalizedQuery)) return 1;
  if (normalizedLabel.includes(normalizedQuery)) return 2;
  return null;
}

export function rankByLabel<T>(
  items: T[],
  query: string,
  getLabel: (item: T) => string,
) {
  return items
    .map((item) => ({ item, score: scoreLabel(getLabel(item), query) }))
    .filter((entry): entry is { item: T; score: number } => entry.score !== null)
    .sort(
      (a, b) =>
        a.score - b.score ||
        getLabel(a.item).localeCompare(getLabel(b.item)),
    )
    .map((entry) => entry.item);
}

export function findExactOrTopRanked<T>(
  items: T[],
  query: string,
  getLabel: (item: T) => string,
) {
  const exact = items.find((item) => getLabel(item) === query.trim());
  if (exact) return exact;

  return rankByLabel(items, query, getLabel)[0] ?? null;
}
