"use client";

import {  useState } from "react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Label } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePresence } from "../providers/PresenceProvider";
import {
  ACTIVITY_STATUS_LABELS,
  STATUS_DURATION_OPTIONS,
  type ActivityStatusValue,
  type ManualActivityStatus,
} from "../../domain/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ActivityStatusIndicator } from "@/components/shared";
import { ChevronRight, Loader2 } from "lucide-react";

const STATUS_OPTIONS: {
  value: ActivityStatusValue;
  label: string;
  description: string;
}[] = [
  {
    value: "online",
    label: ACTIVITY_STATUS_LABELS.online,
    description: "Show as actively online",
  },
  {
    value: "away",
    label: ACTIVITY_STATUS_LABELS.away,
    description: "Show as away from desk",
  },
  {
    value: "dnd",
    label: ACTIVITY_STATUS_LABELS.dnd,
    description: "Do not disturb — manual only",
  },  
  {
    value: "offline",
    label: ACTIVITY_STATUS_LABELS.offline,
    description: "Appear offline to others",
  },
];

export function ActivityStatusPicker() {
  const { myStatus, setStatus } = usePresence();
  const [selectedStatus, setSelectedStatus] = useState<ManualActivityStatus>(myStatus?.status ?? "auto");
  const [durationMinutes, setDurationMinutes] = useState<string>("60");
  const [isSaving, setIsSaving] = useState(false);

  const currentLabel = ACTIVITY_STATUS_LABELS[myStatus?.status ?? "offline"] ?? "Offline";
  
 
    async function handleApply(status: ActivityStatusValue) {
    setIsSaving(true);
    try {
      const duration =
        selectedStatus === "auto"
          ? undefined
          : durationMinutes === "null"
            ? null
            : Number(durationMinutes);

      await setStatus(status, duration);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsSaving(false);
    }
  };
  
  const showDuration = selectedStatus !== "auto";

  return (
    <DropdownMenu>

      
      <DropdownMenuTrigger asChild>
      <Button variant="outline" className="border rounded-xl px-2 justify-between w-full">

       <div className="flex items-center gap-3">
        {isSaving ? <Loader2 className="size-4 text-muted-foreground animate-spin" /> : <ActivityStatusIndicator isBadge={false} status={myStatus?.status ?? "offline"} />}
        <h4 className="text-sm font-semibold">{currentLabel}</h4>
        </div>
        <ChevronRight strokeWidth={3} className="size-4" />
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="center">
          
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => {
                
                setSelectedStatus(option.value)
                handleApply(option.value);
              }}
              className={cn(
                "group/dropdown-menu-item flex items-center gap-3 rounded-xl border p-3 text-left",
                
              )}
            >
              <ActivityStatusIndicator isBadge={false} statusClassName="group-hover/dropdown-menu-item:bg-muted-foreground" status={option.value} />
              <span>
                <span className="text-sm font-medium block">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </DropdownMenuItem>
          ))}
        </div>
      </div>

      {showDuration && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="status-duration" className="text-xs text-muted-foreground">
            How long should this status last?
          </Label>
          <Select value={durationMinutes} onValueChange={setDurationMinutes}>
            <SelectTrigger id="status-duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_DURATION_OPTIONS.map((option) => (
                <SelectItem
                  key={option.label}
                  value={option.minutes === null ? "null" : String(option.minutes)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      </DropdownMenuContent>
     </DropdownMenu>
  );
}
