export type PathSegment = {
  text: string;
  committed: boolean;
};

export type ParsedSearchPath = {
  raw: string;
  segments: PathSegment[];
  headSegment: PathSegment;
  headQuery: string;
  committedSegments: PathSegment[];
};

export function parseSearchPath(query: string): ParsedSearchPath {
  const rawSegments = query.split("/");
  const segments = rawSegments.map((segment, index) => ({
    text: segment.trim(),
    committed: index < rawSegments.length - 1,
  }));
  const normalizedSegments =
    segments.length > 0 ? segments : [{ text: "", committed: false }];
  const headSegment = normalizedSegments[normalizedSegments.length - 1] ?? {
    text: "",
    committed: false,
  };

  return {
    raw: query,
    segments: normalizedSegments,
    headSegment,
    headQuery: headSegment.text,
    committedSegments: normalizedSegments.filter((segment) => segment.committed),
  };
}

export function getHeadSelectionRange(value: string) {
  const slashIndex = value.lastIndexOf("/");

  return {
    start: slashIndex === -1 ? 0 : slashIndex + 1,
    end: value.length,
  };
}
