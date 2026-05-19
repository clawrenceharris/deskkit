import { SettingsItem } from "@/types";
import { SettingsButton } from "./";
import { SCHOOL_SETTINGS } from "@/lib/constants";

type SchoolSettingsPanelProps = {
  onSelect: (setting: SettingsItem) => void;
}
export function SchoolSettingsPanel({ onSelect }: SchoolSettingsPanelProps) {
  
  return (

    <div className="flex h-full min-h-0 flex-col">
        {SCHOOL_SETTINGS.map(s => (
          <SettingsButton key={s.label} setting={s} onClick={() => onSelect(s)}/>
        ))}
    </div>
  );
}