import Image from "next/image";
import { BookOpen, Clock, UserRound } from "lucide-react";
import deskIcon from "@/assets/desk-icon.png";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui";
import type {
  GroupedSearchResults,
  SearchResult,
} from "@/features/search/domain";
import type { RecentSearch } from "@/features/search/infrastructure/recentSearchesStorage";

type GlobalSearchResultsProps = {
  groups: GroupedSearchResults[];
  recentSearches: RecentSearch[];
  showRecentSearches: boolean;
  onRecentSelect: (query: string) => void;
  onResultSelect: (result: SearchResult) => void;
};

function SearchResultItem({
  result,
  onSelect,
}: {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
}) {
  if (result.type === "desk") {
    return (
      <CommandItem value={result.value} onSelect={() => onSelect(result)}>
        <Image
          src={deskIcon}
          alt="Desk"
          width={16}
          height={16}
          draggable={false}
          className="object-contain drop-shadow-md select-none"
          sizes="96px"
        />
        <span className="truncate">{result.desk.name}</span>
      </CommandItem>
    );
  }

  if (result.type === "notebook") {
    return (
      <CommandItem value={result.value} onSelect={() => onSelect(result)}>
        <BookOpen className="text-primary" strokeWidth={3} />
        <span className="truncate">{result.notebook.title}</span>
        <CommandShortcut className="max-w-[160px] truncate">
          {result.desk.name}
        </CommandShortcut>
      </CommandItem>
    );
  }

  return (
    <CommandItem value={result.value} onSelect={() => onSelect(result)}>
      <UserRound className="text-muted-foreground" strokeWidth={3} />
      <span className="truncate">{result.label}</span>
    </CommandItem>
  );
}

export function GlobalSearchResults({
  groups,
  recentSearches,
  showRecentSearches,
  onRecentSelect,
  onResultSelect,
}: GlobalSearchResultsProps) {
  return (
    <>
      {(groups.length > 0 || showRecentSearches) && (
        <CommandGroup>
          <span className="px-3 text-xs text-muted-foreground">
            Use arrow keys to choose a result, Tab to complete it, and Enter to open it.
          </span>
          <CommandSeparator alwaysRender />
        </CommandGroup>
      )}

      {showRecentSearches && (
        <CommandGroup heading="Recent">
          {recentSearches.map((recent) => (
            <CommandItem
              key={recent.id}
              value={`recent:${recent.id}`}
              onSelect={() => onRecentSelect(recent.query)}
            >
              <Clock className="text-muted-foreground" strokeWidth={3} />
              <span className="truncate">{recent.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      )}

      {groups.map((group) => (
        <CommandGroup key={group.id} heading={group.label}>
          {group.results.map((result) => (
            <SearchResultItem
              key={result.value}
              result={result}
              onSelect={onResultSelect}
            />
          ))}
        </CommandGroup>
      ))}
    </>
  );
}
