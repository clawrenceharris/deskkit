import type {
  SearchCategoryId,
  SearchContext,
  SearchDataSource,
  SearchResult,
} from "./types";

export type SearchCategory<TItem> = {
  id: SearchCategoryId;
  label: (context: SearchContext) => string;
  order: number;
  isAvailable: (context: SearchContext) => boolean;
  search: (
    context: SearchContext,
    query: string,
    data: SearchDataSource,
  ) => TItem[];
  toResult: (item: TItem, context: SearchContext) => SearchResult;
  getLabel: (item: TItem) => string;
  autofillSegment: (item: TItem, context: SearchContext) => string;
  hasChildren?: boolean;
};
