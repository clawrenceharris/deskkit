
export type SettingsAction = "edit-profile" | "change-schools" | "sign-out";
export type SettingsItem = {
  label: string;
  icon: React.ReactNode;
  routeTo: Exclude<SettingsRoute, "menu"> | null;
  action: SettingsAction | null;
  

};
export type SettingsRoute = "menu" | "my-profile" | "my-schools" | "sign-out" | "manage-school" | "edit-profile"
  
