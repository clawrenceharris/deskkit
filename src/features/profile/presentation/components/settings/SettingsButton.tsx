import { Button } from "@/components/ui";
import { SettingsItem } from "@/types";
import { ChevronRight } from "lucide-react";

type SettingsButtonProps = {
    onClick: () => void;
    setting: SettingsItem
};
  
export function SettingsButton({
    setting,
    onClick,
  }: SettingsButtonProps) {
    return (
      <Button
        variant="tertiary"
        className="flex w-full justify-between gap-2 hover:bg-muted/70 rounded-lg bg-surface text-foreground shadow-md border border-muted p-4"
        onClick={onClick}
      >
        <div className="inline-flex items-center gap-2">
          {setting.icon}
          {setting.label}
        </div>
        {setting.routeTo && <ChevronRight strokeWidth={3} />}
      </Button>
    );
  }
  