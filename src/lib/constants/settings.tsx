import { SettingsItem } from "@/types/settings";
import { GraduationCap, LogOut, Pencil } from "lucide-react";

export const MAIN_SETTINGS: SettingsItem[]  = [
  {
    label: "My Profile",
    icon: <Pencil className="size-4" />,
    routeTo: "my-profile",
    action: null
  },
  {
      label: "My Schools",
      icon: <GraduationCap className="size-4" />,
      routeTo: "my-schools",
      action: null

  },
  {
    label: "Sign out",
    icon: <LogOut className="size-4" />,
    action: "sign-out",
    routeTo: null


  },
]

export const SCHOOL_SETTINGS: SettingsItem[] = [
  {
    label: "Manage School",
    icon: <GraduationCap className="size-4" />,
    routeTo: "manage-school",
    action: null
  },
]

export const PROFILE_SETTINGS: SettingsItem[] = [
  {
    label: "Edit Profile",
    icon: <Pencil className="size-4" />,
    routeTo: "edit-profile",
    action: null
  },
  
]
  