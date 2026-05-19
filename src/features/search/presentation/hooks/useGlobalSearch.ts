"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { APP_ROUTES, useProfileContext, useUser } from "@/app/providers";
import {
  buildAutoFillQuery,
  buildSearchResults,
  flattenSearchResults,
  getResultSearchPath,
} from "@/features/search/application";
import {
  getHeadSelectionRange,
  parseSearchPath,
  resolveSearchContext,
  type SearchResult,
} from "@/features/search/domain";
import { useJoinedDesksDetail } from "@/features/desk/presentation/hooks/useJoinedDesks";
import { useRecentSearches } from "./useRecentSearches";

type UseGlobalSearchInput = {
  currentDeskName?: string | null;
  currentNotebookTitle?: string | null;
};

function getCurrentDeskId(pathname: string) {
  const [, root, deskId] = pathname.split("/");
  return root === "desks" ? deskId ?? null : null;
}

function getSearchPath(deskName?: string | null, notebookTitle?: string | null) {
  if (!deskName) return "";
  return notebookTitle ? `${deskName} / ${notebookTitle}` : deskName;
}

export function useGlobalSearch({
  currentDeskName,
  currentNotebookTitle,
}: UseGlobalSearchInput) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { openProfile } = useProfileContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const { recentSearches, recordRecentSearch } = useRecentSearches();
  const { data: desks = [], isLoading } = useJoinedDesksDetail(user?.id ?? null);
  const currentDeskId = getCurrentDeskId(pathname);
  const currentDesk = useMemo(
    () => desks.find((desk) => desk.id === currentDeskId) ?? null,
    [currentDeskId, desks],
  );
  const currentSearchPath = useMemo(
    () => getSearchPath(currentDeskName, currentNotebookTitle),
    [currentDeskName, currentNotebookTitle],
  );
  const parsedPath = useMemo(() => parseSearchPath(query), [query]);
  const context = useMemo(
    () => resolveSearchContext(parsedPath, { desks }),
    [desks, parsedPath],
  );
  const groups = useMemo(
    () => buildSearchResults(parsedPath, context, { desks }),
    [context, desks, parsedPath],
  );
  const flatResults = useMemo(() => flattenSearchResults(groups), [groups]);
  const resultByValue = useMemo(
    () => new Map(flatResults.map((result) => [result.value, result])),
    [flatResults],
  );
  const showRecentSearches =
    parsedPath.committedSegments.length === 0 &&
    !parsedPath.headQuery &&
    recentSearches.length > 0;
  const recentValues = useMemo(
    () => recentSearches.map((recent) => `recent:${recent.id}`),
    [recentSearches],
  );
  const visibleRecentValues = useMemo(
    () => (showRecentSearches ? recentValues : []),
    [recentValues, showRecentSearches],
  );
  const commandValues = useMemo(
    () => new Set([...visibleRecentValues, ...flatResults.map((result) => result.value)]),
    [flatResults, visibleRecentValues],
  );
  const firstCommandValue = showRecentSearches
    ? visibleRecentValues[0] ?? flatResults[0]?.value ?? ""
    : flatResults[0]?.value ?? "";
  const activeSelectedValue = commandValues.has(selectedValue)
    ? selectedValue
    : firstCommandValue;
  const selectedResult = resultByValue.get(activeSelectedValue) ?? null;

  const selectHeadPath = useCallback((value: string) => {
    const { start, end } = getHeadSelectionRange(value);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(start, end);
    });
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedValue("");
  }, []);

  const openSearch = useCallback(() => {
    setQuery(currentSearchPath);
    setOpen(true);
    selectHeadPath(currentSearchPath);
  }, [currentSearchPath, selectHeadPath]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);

      if (!nextOpen) {
        setQuery("");
        setSelectedValue("");
        return;
      }

      setQuery(currentSearchPath);
      selectHeadPath(currentSearchPath);
    },
    [currentSearchPath, selectHeadPath],
  );

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      const recentQuery = getResultSearchPath(result, context);
      recordRecentSearch({
        query: recentQuery,
        label: recentQuery,
      });

      if (result.type === "desk") {
        router.push(APP_ROUTES.desk(result.desk.id));
        closeSearch();
        return;
      }

      if (result.type === "notebook") {
        router.push(APP_ROUTES.notebook(result.desk.id, result.notebook.id));
        closeSearch();
        return;
      }

      openProfile(result.profile.userId);
      closeSearch();
    },
    [closeSearch, context, openProfile, recordRecentSearch, router],
  );

  const handleRecentSelect = useCallback(
    (recentQuery: string) => {
      setQuery(recentQuery);
      selectHeadPath(recentQuery);
    },
    [selectHeadPath],
  );

  const handleAutoFill = useCallback(() => {
    if (!selectedResult) return;

    const nextQuery = buildAutoFillQuery(parsedPath, selectedResult, context);
    setQuery(nextQuery);
    selectHeadPath(nextQuery);
  }, [context, parsedPath, selectHeadPath, selectedResult]);

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && selectedResult) {
        event.preventDefault();
        navigateToResult(selectedResult);
        return;
      }

      if (event.key === "Tab" && selectedResult) {
        event.preventDefault();
        handleAutoFill();
      }
    },
    [handleAutoFill, navigateToResult, selectedResult],
  );

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        if (open) {
          closeSearch();
          return;
        }

        openSearch();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeSearch, open, openSearch]);

  return {
    context,
    currentDesk,
    currentSearchPath,
    flatResults,
    groups,
    handleInputKeyDown,
    handleOpenChange,
    handleRecentSelect,
    inputRef,
    isLoading,
    navigateToResult,
    open,
    openSearch,
    query,
    recentSearches,
    selectedValue: activeSelectedValue,
    setQuery,
    setSelectedValue,
    showRecentSearches,
  };
}
