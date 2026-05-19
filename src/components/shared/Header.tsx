"use client"
import { ProfileButton,ThemeButton } from ".";
import { GlobalSearch } from "./GlobalSearch";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useDesk } from "@/features/desk/presentation/hooks";
import { useNotebook } from "@/features/notebook/presentation/hooks";
import Link from "next/link";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";

type HeaderProps = {
  searchEnabled?: boolean;
  profile: ProfileForDetail | null;
}
export function Header({searchEnabled = false, profile}: HeaderProps) {
  const pathname = usePathname();
  const [, root, deskId, section, notebookId] = pathname.split("/");
  const currentDeskId = root === "desks" ? deskId ?? null : null;
  const currentNotebookId = root === "desks" && section === "notebooks" ? notebookId ?? null : null;
  const { data: currentDesk } = useDesk(currentDeskId);
  const { data: currentNotebook } = useNotebook(currentNotebookId);
  return (
      <header className="flex items-center gap-4 justify-between px-4">

        <div className="flex items-center gap-4">
          {profile && (
            <ProfileButton 
            className="p-1"
            profile={profile} 
            showsName={false} 
          />)}
          <ThemeButton /> 
        </div>
        
        {searchEnabled && ( 
          <GlobalSearch
            currentDeskName={currentDesk?.name}
            currentNotebookTitle={currentNotebook?.title}
          />
        )}
        <Link href="/" className="flex items-center gap-2 justify-center bg-white shadow-md rounded-full size-[50px]">
          <Image src="/images/logo-secondary-2.png" alt="Desk Share Logo" width={40} height={40}/>
        </Link>
      </header>
  );
}