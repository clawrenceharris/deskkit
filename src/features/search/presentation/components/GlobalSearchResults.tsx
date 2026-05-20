import { Clock } from "lucide-react";
import deskIcon from "@/assets/desk-icon.png";
import notebookIcon from "@/assets/notebook-icon.png";
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
import { Icon } from "@/components/shared";
import { ProfileAvatar } from "@/features/profile/presentation/components/ui";
import tabIcon from "@/assets/tab.png";
type GlobalSearchResultsProps = {
  groups: GroupedSearchResults[];
  recentSearches: RecentSearch[];
  selectedValue: string;
  showRecentSearches: boolean;
  onRecentSelect: (query: string) => void;
  onResultSelect: (result: SearchResult) => void;
};

function FillHint() {
  return (
    <span className="pointer-events-none absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded bg-background/90 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
      <Icon src={tabIcon} alt="Tab Icon" className="opacity-40" />
      <span>Fill</span>
    </span>
  );
}

function SearchResultItem({
  result,
  selected,
  onSelect,
}: {
  result: SearchResult;
  selected: boolean;
  onSelect: (result: SearchResult) => void;
}) {
  if (result.type === "desk") {
    return (
      <CommandItem
        className={`group/desk-result ${selected ? "pr-24" : ""}`}
        value={result.value}
        onSelect={() => onSelect(result)}
      >
        <Icon src={deskIcon} alt="Desk" className="object-contain opacity-50 drop-shadow-md select-none group-focus-within/desk-result:opacity-100" />
        <span className="truncate">{result.desk.name}</span>
        {selected && <FillHint />}
      </CommandItem>
    );
  }

  if (result.type === "notebook") {
    return (
      <CommandItem
        className={`group/notebook-result ${selected ? "pr-24" : ""}`}
        value={result.value}
        onSelect={() => onSelect(result)}
      >
        <Icon src={notebookIcon} alt="Notebook" className="opacity-50 group-focus-within/notebook-result:opacity-100" />
        <span className="truncate">{result.notebook.title}</span>
        
        {selected && <FillHint />}
      </CommandItem>
    );
  }

  return (
    <CommandItem
      className={`group/user-result ${selected ? "pr-24" : ""}`}
      value={result.value}
      onSelect={() => onSelect(result)}
    >
      <ProfileAvatar status="online" size="sm" profile={result.profile}/>
      <span className="truncate">{result.profile.displayName ?? result.profile.username} {result.profile.displayName && <span className="text-muted-foreground">{result.profile.username}</span>}</span>
      {selected && <FillHint />}
    </CommandItem>
  );
}

export function GlobalSearchResults({
  groups,
  recentSearches,
  selectedValue,
  showRecentSearches,
  onRecentSelect,
  onResultSelect,
}: GlobalSearchResultsProps) {
  const visibleGroups = groups.filter((group) => group.results.length > 0);

  return (
    <>
      {(visibleGroups.length > 0 || showRecentSearches) && (
        <CommandGroup>
          <span className="px-3 text-xs text-muted-foreground">
            Press Tab to fill the focused result, and Enter to open it.
          </span>
          <CommandSeparator alwaysRender />
        </CommandGroup>
      )}

      {showRecentSearches && (
        <CommandGroup heading="Recent">
          {recentSearches.map((recent) => (
            <CommandItem
              key={recent.id}
              className={selectedValue === `recent:${recent.id}` ? "pr-24" : ""}
              value={`recent:${recent.id}`}
              onSelect={() => onRecentSelect(recent.query)}
            >
              <Clock className="text-muted-foreground" strokeWidth={3} />
              <span className="truncate">{recent.label}</span>
              {selectedValue === `recent:${recent.id}` && <FillHint />}
            </CommandItem>
          ))}
        </CommandGroup>
      )}

      {visibleGroups.map((group) => (
        <CommandGroup key={group.id} heading={group.label}>
          {group.results.map((result) => (
            <SearchResultItem
              key={result.value}
              result={result}
              selected={selectedValue === result.value}
              onSelect={onResultSelect}
            />
          ))}
        </CommandGroup>
      ))}
    </>
  );
}
