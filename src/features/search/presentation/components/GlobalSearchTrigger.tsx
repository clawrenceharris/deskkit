import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type GlobalSearchTriggerProps = {
  currentDeskName?: string | null;
  currentNotebookTitle?: string | null;
  onOpen: () => void;
};

export function GlobalSearchTrigger({
  currentDeskName,
  currentNotebookTitle,
  onOpen,
}: GlobalSearchTriggerProps) {
  const triggerLabel = currentDeskName ? (
    <span className="truncate">
      <span className="font-bold text-primary">Desk</span>
      <span className="mx-1 text-muted-foreground">/</span>
      <span>{currentDeskName}</span>
      {currentNotebookTitle && (
        <>
          <span className="mx-1 text-muted-foreground">/</span>
          <span className="font-bold text-primary">Notebook</span>
          <span className="mx-1 text-muted-foreground">/</span>
          <span>{currentNotebookTitle}</span>
        </>
      )}
    </span>
  ) : (
    <span className="text-muted-foreground">Type to navigate</span>
  );

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex min-w-[220px] max-w-[520px] items-center justify-between gap-3 rounded-md bg-muted px-3 py-2 text-sm",
        "transition-colors hover:bg-muted/80 focus-visible:outline-2 focus-visible:outline-primary",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={3} />
        {triggerLabel}
      </span>
      <kbd className="inline-flex shrink-0 items-center gap-0.5 rounded border border-muted-foreground/40 bg-background px-2 py-1 font-mono text-xs font-semibold shadow-sm">
        <span>⌘</span>
        <span>K</span>
      </kbd>
    </button>
  );
}
