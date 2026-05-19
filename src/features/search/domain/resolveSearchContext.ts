import type { ParsedSearchPath } from "./parseSearchPath";
import { findExactOrTopRanked } from "./rankByLabel";
import type { SearchContext, SearchDataSource } from "./types";

export function resolveSearchContext(
  parsedPath: ParsedSearchPath,
  data: SearchDataSource,
): SearchContext {
  const context: SearchContext = {
    resolvedSegments: [],
  };
  const [deskSegment, secondSegment] = parsedPath.committedSegments;

  if (!deskSegment) {
    return context;
  }

  const desk = findExactOrTopRanked(
    data.desks,
    deskSegment.text,
    (item) => item.name,
  );

  if (!desk) {
    return context;
  }

  context.desk = desk;
  context.resolvedSegments.push(desk.name);

  if (!secondSegment) {
    return context;
  }

  const notebook = findExactOrTopRanked(
    desk.notebooks,
    secondSegment.text,
    (item) => item.title,
  );

  if (!notebook) {
    return context;
  }

  context.notebook = notebook;
  context.resolvedSegments.push(notebook.title);

  return context;
}
