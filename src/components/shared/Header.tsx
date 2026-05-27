"use client"
import { Icon, ProfileButton,ThemeButton } from ".";
import { GlobalSearch } from "./GlobalSearch";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useDesk } from "@/features/desk/presentation/hooks";
import { useNotebook } from "@/features/notebook/presentation/hooks";
import Link from "next/link";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "../ui";
import desk from "@/assets/desk.png";
import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
  const router = useRouter();

  return (
    <header className="flex items-center gap-4 justify-between sticky top-0">
      {profile && (
        
        <div className="flex items-center gap-4 px-3 py-2 bg-surface  shadow-sm border rounded-xl" >
        <Tooltip>
          <TooltipTrigger asChild>
              <ProfileButton 
                profile={profile} 
                showsName={false} 
                className="border-0"
              />
            
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-semibold text-muted-foreground">My Profile</p>
          </TooltipContent>
        </Tooltip>
          
        {profile.myDesk &&   (
          
          <Tooltip>

            <TooltipTrigger asChild>
              <Button onClick={() => router.push(`/desks/${profile?.myDesk?.desk.id}`)} size="icon" className="flex cursor-pointer items-center justify-center size-11 bg-linear-to-t from-primary to-primary/50 rounded-full">
                <Icon src={desk} alt="Desk" className="size-9" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm font-semibold text-muted-foreground">My Desk</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
        )}

       
      {searchEnabled && ( 
        <GlobalSearch
          currentDeskName={currentDesk?.name}
          currentNotebookTitle={currentNotebook?.title}
        />
      )}
      <div className={cn("flex items-center gap-2", !profile && "justify-between w-full")}>
      
        <ThemeButton /> 
        <Link href="/" className="flex items-center gap-2 justify-center bg-white shadow-md rounded-full size-[50px]">
          <Image src="/images/logo-secondary-2.png" alt="Desk Share Logo" width={40} height={40}/>
        </Link>
      </div>   
    </header>
  );
}