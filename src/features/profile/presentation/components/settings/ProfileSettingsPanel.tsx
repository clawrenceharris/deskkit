import { SettingsItem } from "@/types";
import { SettingsButton } from "./";
import { PROFILE_SETTINGS } from "@/lib/constants";

type ProfileSettingsPanelProps = {
  onSelect: (setting: SettingsItem) => void;
}
export function ProfileSettingsPanel({ onSelect }: ProfileSettingsPanelProps) {
  
  return (

    <div className="flex h-full min-h-0 flex-col">
        {PROFILE_SETTINGS.map(s => (
          <SettingsButton key={s.label} setting={s} onClick={() => onSelect(s)}/>
        ))}
    </div>
  );
}