import { DeskSection } from "@/app/providers/HomeNavigationProvider";
import { useDeskContext } from "@/app/providers";
import { NavButton } from "@/components/shared";
import { cn } from "@/lib/utils";
import chalkboard from "@/assets/chalkboard.png";
import notebook from "@/assets/notebook.png";
import desk from "@/assets/desk.png";
import users from "@/assets/users.png";
import gear from "@/assets/gear.png";

type DeskNavbarProps = {
  onNavigate: (section: DeskSection) => void;
  className?: string;
  orientation?: "horizontal" | "vertical";
  showsLabels?: boolean;
  sections?: DeskSection[];
}

export function DeskNavbar({onNavigate, className, orientation = "horizontal", showsLabels = true, sections = [DeskSection.home, DeskSection.members, DeskSection.settings]}: DeskNavbarProps) {
  const { currentSection } = useDeskContext();
  function getSectionLabel(section: DeskSection){
    switch(section){
      case DeskSection.notebooks:
        return "Notebooks";
      case DeskSection.home: 
        return "Home"
      case DeskSection.chalkboards:
        return "Chalkboard";
      case DeskSection.settings: 
        return "Manage";
      case DeskSection.members: 
        return "Members"
    }
  }
  function getSectionIcon(section: DeskSection){
    switch(section){
      case DeskSection.notebooks:
        return notebook;
   
      case DeskSection.home: 
        return desk;
      case DeskSection.chalkboards:
        return chalkboard;
      case DeskSection.settings: 
        return gear;
      case DeskSection.members: 
        return users;
   
    }
  }
  return (
    <nav className={cn("w-full flex flex-col gap-2 border-b", className)}>

      <ul className={cn("flex h-full w-full flex-row gap-2 justify-evenly py-3", orientation === "horizontal" ? "flex-row" : "flex-col")}>
        {sections.map(s => (
          <li key={s} className="flex items-center justify-center relative">
         <NavButton selected={currentSection === s} icon={getSectionIcon(s)} label={showsLabels ? getSectionLabel(s) : ""} onClick={() => onNavigate(s)} />
         </li>
        ))}
      </ul>
    </nav>
  );
}



