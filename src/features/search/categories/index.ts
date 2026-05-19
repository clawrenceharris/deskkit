import type { SearchCategory } from "@/features/search/domain";
import { getProfileLabel, getProfileSearchText, rankByLabel } from "@/features/search/domain";
import type {
  DeskSearchResult,
  MemberProfileSearchItem,
  NotebookSearchItem,
  NotebookSearchResult,
  SearchContext,
  SearchDataSource,
  UserSearchResult,
} from "@/features/search/domain";
import type { DeskForDetail } from "@/features/desk/infrastructure/queries";

type NotebookCategoryItem = {
  desk: DeskForDetail;
  notebook: NotebookSearchItem;
};

type UserCategoryItem = MemberProfileSearchItem;

const deskCategory: SearchCategory<DeskForDetail> = {
  id: "desk",
  label: () => "Desks",
  order: 10,
  isAvailable: (context) => !context.desk,
  search: (_context, query, data) =>
    rankByLabel(data.desks, query, (desk) => desk.name).slice(0, 8),
  toResult: (desk): DeskSearchResult => ({
    type: "desk",
    categoryId: "desk",
    value: `desk:${desk.id}`,
    label: desk.name,
    desk,
  }),
  getLabel: (desk) => desk.name,
  autofillSegment: (desk) => desk.name,
  hasChildren: true,
};

const notebookCategory: SearchCategory<NotebookCategoryItem> = {
  id: "notebook",
  label: (context) =>
    context.desk ? `Notebooks in ${context.desk.name}` : "Notebooks",
  order: 20,
  isAvailable: (context) => !context.notebook,
  search: (context, query, data) => {
    if (context.desk) {
      return rankByLabel(
        context.desk.notebooks,
        query,
        (notebook) => notebook.title,
      )
        .slice(0, 8)
        .map((notebook) => ({ desk: context.desk as DeskForDetail, notebook }));
    }

    return data.desks
      .flatMap((desk) =>
        rankByLabel(desk.notebooks, query, (notebook) => notebook.title)
          .slice(0, 3)
          .map((notebook) => ({ desk, notebook })),
      )
      .slice(0, 8);
  },
  toResult: ({ desk, notebook }): NotebookSearchResult => ({
    type: "notebook",
    categoryId: "notebook",
    value: `notebook:${notebook.id}`,
    label: notebook.title,
    desk,
    notebook,
  }),
  getLabel: ({ notebook }) => notebook.title,
  autofillSegment: ({ notebook }) => notebook.title,
};

const userCategory: SearchCategory<UserCategoryItem> = {
  id: "user",
  label: (context) => (context.desk ? `People in ${context.desk.name}` : "People"),
  order: 30,
  isAvailable: (context) => !context.notebook,
  search: (context, query, data) => {
    const profiles = new Map<string, MemberProfileSearchItem>();
    const desks = context.desk ? [context.desk] : data.desks;

    for (const desk of desks) {
      for (const member of desk.members) {
        profiles.set(member.profile.userId, member.profile);
      }
    }

    return rankByLabel(
      [...profiles.values()],
      query,
      getProfileSearchText,
    ).slice(0, 5);
  },
  toResult: (profile): UserSearchResult => ({
    type: "user",
    categoryId: "user",
    value: `user:${profile.userId}`,
    label: getProfileLabel(profile),
    profile,
  }),
  getLabel: getProfileLabel,
  autofillSegment: getProfileLabel,
};

const chalkboardCategory: SearchCategory<never> = {
  id: "chalkboard",
  label: () => "Chalkboards",
  order: 40,
  isAvailable: (context) => !!context.desk && !context.notebook,
  search: () => [],
  toResult: () => {
    throw new Error("Chalkboard search results are not implemented yet.");
  },
  getLabel: () => "",
  autofillSegment: () => "",
  hasChildren: true,
};

const studyRoomCategory: SearchCategory<never> = {
  id: "studyRoom",
  label: () => "Study rooms",
  order: 50,
  isAvailable: (context) => !!context.desk && !context.notebook,
  search: () => [],
  toResult: () => {
    throw new Error("Study room search results are not implemented yet.");
  },
  getLabel: () => "",
  autofillSegment: () => "",
};

const materialCategory: SearchCategory<never> = {
  id: "material",
  label: () => "Materials",
  order: 60,
  isAvailable: (context) => !!context.notebook,
  search: () => [],
  toResult: () => {
    throw new Error("Material search results are not implemented yet.");
  },
  getLabel: () => "",
  autofillSegment: () => "",
};

export const searchCategories = [
  deskCategory,
  notebookCategory,
  userCategory,
  chalkboardCategory,
  studyRoomCategory,
  materialCategory,
] as SearchCategory<unknown>[];

export function getSearchCategory(id: string) {
  return searchCategories.find((category) => category.id === id) ?? null;
}

export type { SearchContext, SearchDataSource };
