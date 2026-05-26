"use client";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui";
import { GlobalSearchResults } from "./components/GlobalSearchResults";
import { GlobalSearchTips } from "./components/GlobalSearchTips";
import { GlobalSearchTrigger } from "./components/GlobalSearchTrigger";
import { useGlobalSearch } from "./hooks/useGlobalSearch";

export type GlobalSearchProps = {
  currentDeskName?: string | null;
  currentNotebookTitle?: string | null;
};

export function GlobalSearch({
  currentDeskName,
  currentNotebookTitle,
}: GlobalSearchProps) {
  const {
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
    selectedValue,
    setQuery,
    setSelectedValue,
    showRecentSearches,
  } = useGlobalSearch({
    currentDeskName,
    currentNotebookTitle,
  });
  const hasResults = groups.length > 0 || showRecentSearches;

  return (
    <>
      <GlobalSearchTrigger
        currentDeskName={currentDeskName}
        currentNotebookTitle={currentNotebookTitle}
        onOpen={openSearch}
      />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          title="Search Deskitt"
          description="Jump between desks, notebooks, and people without leaving the current layout."
        >
          <Command
            className="bg-surface border"
            shouldFilter={false}
            value={selectedValue}
            onValueChange={setSelectedValue}
          >
            <CommandInput
              ref={inputRef}
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Where do you want to go?"
              onKeyDown={handleInputKeyDown}
            />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Loading search...</CommandEmpty>
              ) : !hasResults ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : null}

              <GlobalSearchResults
                groups={groups}
                recentSearches={recentSearches}
                selectedValue={selectedValue}
                showRecentSearches={showRecentSearches}
                onRecentSelect={handleRecentSelect}
                onResultSelect={navigateToResult}
              />
            </CommandList>
          </Command>
          <DialogFooter className="block text-xs text-muted-foreground">
            <GlobalSearchTips />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
