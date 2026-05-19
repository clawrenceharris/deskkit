import type { DeskForDetail } from "@/features/desk/infrastructure/queries";

export type NotebookSearchItem = DeskForDetail["notebooks"][number];
export type MemberProfileSearchItem = DeskForDetail["members"][number]["profile"];

export type SearchCategoryId =
  | "desk"
  | "notebook"
  | "user"
  | "chalkboard"
  | "studyRoom"
  | "material"
  | "thread";

export type SearchContext = {
  desk?: DeskForDetail;
  notebook?: NotebookSearchItem;
  resolvedSegments: string[];
};

export type SearchDataSource = {
  desks: DeskForDetail[];
};

type BaseSearchResult = {
  value: string;
  label: string;
  categoryId: SearchCategoryId;
};

export type DeskSearchResult = BaseSearchResult & {
  type: "desk";
  desk: DeskForDetail;
};

export type NotebookSearchResult = BaseSearchResult & {
  type: "notebook";
  desk: DeskForDetail;
  notebook: NotebookSearchItem;
};

export type UserSearchResult = BaseSearchResult & {
  type: "user";
  profile: MemberProfileSearchItem;
};

export type SearchResult =
  | DeskSearchResult
  | NotebookSearchResult
  | UserSearchResult;

export type GroupedSearchResults = {
  id: SearchCategoryId;
  label: string;
  results: SearchResult[];
};
