import { getSearchCategory } from "@/features/search/categories";
import { getProfileLabel } from "@/features/search/domain";
import type {
  ParsedSearchPath,
  SearchContext,
  SearchResult,
} from "@/features/search/domain";

function joinSearchPath(segments: string[], hasTrailingSlash = false) {
  const path = segments.filter(Boolean).join(" / ");
  return hasTrailingSlash ? `${path} / ` : path;
}

export function getResultSearchPath(
  result: SearchResult,
  context: SearchContext = { resolvedSegments: [] },
) {
  if (result.type === "desk") {
    return result.desk.name;
  }

  if (result.type === "notebook") {
    return joinSearchPath([result.desk.name, result.notebook.title]);
  }

  if (context.desk) {
    return joinSearchPath([context.desk.name, getProfileLabel(result.profile)]);
  }

  return getProfileLabel(result.profile);
}

export function buildAutoFillQuery(
  parsedPath: ParsedSearchPath,
  result: SearchResult,
  context: SearchContext,
) {
  const category = getSearchCategory(result.categoryId);
  const hasChildren = category?.hasChildren ?? false;

  if (result.type === "desk") {
    return joinSearchPath([result.desk.name], hasChildren);
  }

  if (result.type === "notebook") {
    return joinSearchPath([result.desk.name, result.notebook.title], hasChildren);
  }

  const previousSegments = context.resolvedSegments.length
    ? context.resolvedSegments
    : parsedPath.committedSegments.map((segment) => segment.text);

  return joinSearchPath([...previousSegments, getProfileLabel(result.profile)], hasChildren);
}
