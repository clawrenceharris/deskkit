"use client";

import { MAIN_SETTINGS } from "@/lib/constants/settings";
import { SettingsItem } from "@/types";
import { SettingsButton } from "./";

type ProfileSettingsListProps = {
  onSelect: (setting: SettingsItem) => void;
};

export function ProfileSettingsList({ onSelect }: ProfileSettingsListProps) {
  
  return (
    <>
      {MAIN_SETTINGS.map((s) => (
        <SettingsButton
          key={s.label}
          setting={s}
          onClick={() => onSelect(s)}
        />
      ))}
    </>
  );
}
