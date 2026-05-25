import { NavButton } from "@/components/shared";
import { ProfileTab } from "@/types";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { useAuth } from "@/app/providers";
import desk from "@/assets/desk.png";
import notebook from "@/assets/notebook.png";
import settings from "@/assets/gear.png";
import profileIcon from "@/assets/profile.png";
import { cn } from "@/lib/utils";

type ProfileNavbarProps = {
  onTabClick: (tab: ProfileTab) => void;
  currentTab: ProfileTab | null;
  profile: ProfileForDetail;
  className?: string;
}
export function ProfileNavbar({onTabClick, currentTab, profile, className}: ProfileNavbarProps) {
  const { user } = useAuth();
  return (
    <nav className={cn("flex flex-col gap-2 p-3 border-b", className)}>
      <ul className="flex flex-1 flex-row gap-2 justify-between">
        <li>
          <NavButton selected={currentTab === ProfileTab.PROFILE} icon={profileIcon} label="Profile" onClick={() => onTabClick(ProfileTab.PROFILE)} />
        </li>
        <li>
          <NavButton selected={currentTab === ProfileTab.DESKS} icon={desk} label="Desks" onClick={() => onTabClick(ProfileTab.DESKS)} />
        </li>
        <li>
          <NavButton selected={currentTab === ProfileTab.NOTEBOOKS} icon={notebook} label="Notebooks" onClick={() => onTabClick(ProfileTab.NOTEBOOKS)} />
        </li>
        {profile.userId === user?.id && (
          <li>
              <NavButton selected={currentTab === ProfileTab.SETTINGS} icon={settings} label="Settings" onClick={() => onTabClick(ProfileTab.SETTINGS)} />
          </li>
        )}
      </ul>
    </nav>
  );
}
  
    
    