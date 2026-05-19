import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockRouter } from "@/test/utils";
import { GlobalSearch, buildAutoFillQuery } from "../GlobalSearch";
import { parseSearchPath, resolveSearchContext } from "@/features/search/domain";
import { buildSearchResults } from "@/features/search/application";
import type { DeskForDetail } from "@/features/desk/infrastructure/queries";

const mocks = vi.hoisted(() => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useUser: vi.fn(),
  useProfileContext: vi.fn(),
  useJoinedDesksDetail: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => mocks.useRouter(),
  usePathname: () => mocks.usePathname(),
}));

vi.mock("@/app/providers", () => ({
  APP_ROUTES: {
    desk: (deskId: string) => `/desks/${deskId}`,
    notebook: (deskId: string, notebookId: string) =>
      `/desks/${deskId}/notebooks/${notebookId}`,
  },
  useProfileContext: () => mocks.useProfileContext(),
  useUser: () => mocks.useUser(),
}));

vi.mock("@/features/desk/presentation/hooks/useJoinedDesks", () => ({
  useJoinedDesksDetail: () => mocks.useJoinedDesksDetail(),
}));

describe("GlobalSearch", () => {
  const desks = [
    {
      id: "desk-1",
      name: "Math",
      members: [],
      notebooks: [{ id: "notebook-1", title: "Algebra" }],
    },
    {
      id: "desk-2",
      name: "Biology Desk",
      members: [],
      notebooks: [{ id: "notebook-2", title: "Cells" }],
    },
  ] as unknown as DeskForDetail[];

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useRouter.mockReturnValue(createMockRouter());
    mocks.usePathname.mockReturnValue("/desks/desk-1");
    mocks.useUser.mockReturnValue({ user: { id: "user-1" } });
    mocks.useProfileContext.mockReturnValue({ openProfile: vi.fn() });
    mocks.useJoinedDesksDetail.mockReturnValue({
      data: desks,
      isLoading: false,
    });
  });

  it("renders the search trigger and opens the command input", async () => {
    const user = userEvent.setup();

    render(
      <GlobalSearch currentDeskName="Math" currentNotebookTitle="Algebra" />,
    );

    await user.click(screen.getByRole("button"));

    expect(screen.getByPlaceholderText("Where do you want to go?")).toBeInTheDocument();
  });

  it("builds a canonical query from the selected result", () => {
    const parsed = parseSearchPath("Biolog / ce");
    const context = resolveSearchContext(parsed, { desks });
    const groups = buildSearchResults(parsed, context, { desks });
    const selectedResult = groups[0]?.results[0];

    expect(selectedResult).toBeDefined();
    expect(buildAutoFillQuery(parsed, selectedResult!, context)).toBe(
      "Biology Desk / Cells",
    );
  });
});
