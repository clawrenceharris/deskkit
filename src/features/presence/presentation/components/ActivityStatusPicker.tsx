"use client";

import { useState } from "react";
import { Button, Label } from "@/components/ui";
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
import { Loader2, Moon, Circle, Ban, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_OPTIONS: {
  value: ManualActivityStatus;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: "auto",
    label: "Automatic",
    icon: <Wifi className="size-4" />,
    description: "Based on your activity and connection",
  },
  {
    value: "online",
    label: ACTIVITY_STATUS_LABELS.online,
    icon: <Circle className="size-4 fill-success text-success" />,
    description: "Show as actively online",
  },
  {
    value: "away",
    label: ACTIVITY_STATUS_LABELS.away,
    icon: <Circle className="size-4 fill-orange-400 text-orange-400" />,
    description: "Show as away from desk",
  },
  {
    value: "dnd",
    label: ACTIVITY_STATUS_LABELS.dnd,
    icon: <Moon className="size-4" />,
    description: "Do not disturb — manual only",
  },
  {
    value: "offline",
    label: ACTIVITY_STATUS_LABELS.offline,
    icon: <Ban className="size-4" />,
    description: "Appear offline to others",
  },
];

function formatExpiresAt(expiresAt: string | null): string | null {
  if (!expiresAt) return null;
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ActivityStatusPicker() {
  const { myStatus, setStatus, isConnected } = usePresence();
  const [selectedStatus, setSelectedStatus] = useState<ManualActivityStatus>(
    myStatus?.isManual ? myStatus.status : "auto",
  );
  const [durationMinutes, setDurationMinutes] = useState<string>("60");
  const [isSaving, setIsSaving] = useState(false);

  const currentLabel = myStatus
    ? myStatus.isManual
      ? ACTIVITY_STATUS_LABELS[myStatus.status]
      : `Automatic (${ACTIVITY_STATUS_LABELS[myStatus.status]})`
    : "Offline";

  const expiresLabel = myStatus?.expiresAt
    ? formatExpiresAt(myStatus.expiresAt)
    : null;

  async function handleApply() {
    setIsSaving(true);
    try {
      const duration =
        selectedStatus === "auto"
          ? undefined
          : durationMinutes === "null"
            ? null
            : Number(durationMinutes);

      await setStatus(selectedStatus, duration);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsSaving(false);
    }
  }

  const showDuration = selectedStatus !== "auto";

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-surface p-4 shadow-md">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold">Activity Status</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Current: {currentLabel}
            {expiresLabel ? ` · until ${expiresLabel}` : null}
          </p>
        </div>
        <span
          className={cn(
            "size-2 rounded-full shrink-0",
            isConnected ? "bg-success" : "bg-gray-400",
          )}
          title={isConnected ? "Connected to presence server" : "Disconnected"}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Set status</Label>
        <div className="flex flex-col gap-1">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedStatus(option.value)}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                selectedStatus === option.value
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:bg-muted/50",
              )}
            >
              <span className="mt-0.5">{option.icon}</span>
              <span>
                <span className="text-sm font-medium block">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </button>
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

      <Button
        type="button"
        variant="tertiary"
        size="sm"
        disabled={isSaving}
        onClick={() => void handleApply()}
      >
        {isSaving ? <Loader2 className="size-4 animate-spin" /> : "Apply status"}
      </Button>
    </div>
  );
}
