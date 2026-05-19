import { describe, expect, it } from "vitest";
import {
  buildAutoFillQuery,
  buildSearchResults,
} from "@/features/search/application";
import {
  parseSearchPath,
  resolveSearchContext,
} from "@/features/search/domain";
import type { DeskForDetail } from "@/features/desk/infrastructure/queries";

const desks = [
  {
    id: "desk-1",
    name: "Biology Desk",
    members: [
      {
        role: "member",
        profile: {
          userId: "user-1",
          username: "caleb",
          displayName: "Caleb",
          avatarUrl: null,
        },
      },
    ],
    notebooks: [
      {
        id: "notebook-1",
        title: "Cell Notes",
      },
    ],
  },
  {
    id: "desk-2",
    name: "Math Desk",
    members: [],
    notebooks: [
      {
        id: "notebook-2",
        title: "Algebra",
      },
    ],
  },
] as unknown as DeskForDetail[];

describe("search domain", () => {
  it("parses slash-delimited committed path segments", () => {
    const parsed = parseSearchPath(" Biology / Cell ");

    expect(parsed.committedSegments).toEqual([
      { text: "Biology", committed: true },
    ]);
    expect(parsed.headQuery).toBe("Cell");
  });

  it("resolves a committed partial desk name to the top-ranked desk without rewriting the raw query", () => {
    const parsed = parseSearchPath("Biolog / ");
    const context = resolveSearchContext(parsed, { desks });

    expect(parsed.raw).toBe("Biolog / ");
    expect(context.desk?.name).toBe("Biology Desk");
  });

  it("shows global categories before anything is committed", () => {
    const groups = buildSearchResults(
      parseSearchPath(""),
      { resolvedSegments: [] },
      { desks },
    );

    expect(groups.map((group) => group.id)).toContain("desk");
    expect(groups.map((group) => group.id)).toContain("notebook");
    expect(groups.map((group) => group.id)).toContain("user");
  });

  it("limits results to desk-scoped categories after a desk is committed", () => {
    const parsed = parseSearchPath("Biolog / ");
    const context = resolveSearchContext(parsed, { desks });
    const groups = buildSearchResults(parsed, context, { desks });

    expect(groups.map((group) => group.id)).toEqual(["notebook", "user"]);
    expect(groups[0]?.results[0]?.label).toBe("Cell Notes");
  });

  it("autofills the selected result with canonical capitalization", () => {
    const parsed = parseSearchPath("Biolog / cell");
    const context = resolveSearchContext(parsed, { desks });
    const groups = buildSearchResults(parsed, context, { desks });
    const selectedResult = groups[0]?.results[0];

    expect(selectedResult).toBeDefined();
    expect(buildAutoFillQuery(parsed, selectedResult!, context)).toBe(
      "Biology Desk / Cell Notes",
    );
  });
});
