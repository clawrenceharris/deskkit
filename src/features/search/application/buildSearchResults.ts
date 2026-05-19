import { searchCategories } from "@/features/search/categories";
import type {
  GroupedSearchResults,
  SearchContext,
  SearchDataSource,
} from "@/features/search/domain";
import type { ParsedSearchPath } from "@/features/search/domain";

export function buildSearchResults(
  parsedPath: ParsedSearchPath,
  context: SearchContext,
  data: SearchDataSource,
): GroupedSearchResults[] {
  if (parsedPath.committedSegments.length > 0 && !context.desk) {
    return [];
  }

  return searchCategories
    .filter((category) => category.isAvailable(context))
    .sort((a, b) => a.order - b.order)
    .map((category) => {
      const results = category
        .search(context, parsedPath.headQuery, data)
        .map((item) => category.toResult(item, context));

      return {
        id: category.id,
        label: category.label(context),
        results,
      };
    })
    .filter((group) => group.results.length > 0);
}

export function flattenSearchResults(groups: GroupedSearchResults[]) {
  return groups.flatMap((group) => group.results);
}
