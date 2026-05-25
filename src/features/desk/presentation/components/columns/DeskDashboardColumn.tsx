"use client";
import { AvatarGroup, AvatarGroupCount } from "@/components/ui";
import { useDeskDetail } from "../../hooks/useDesk";
import {  LoadingState } from "@/components/states";
import { DeskNavbar } from "../ui/DeskNavbar";
import { useDeskPolicy } from "../../hooks";
import { DeskSection, useDeskContext, useHomeNavigation, useUser } from "@/app/providers";
import { DeskSpaceCard } from "../ui";
import { chalkboardSupplies, notebookSupplies, studyRoomsSupplies } from "@/lib/constants";
import { ProfileAvatarWithStatus } from "@/features/presence/presentation/components";

type DeskDetailsColumnProps = {
    deskId: string;
}

export function DeskDashboardColumn({deskId}: DeskDetailsColumnProps) {
  const { data: desk, isLoading } = useDeskDetail(deskId);
  const { user } = useUser();
  const { data: deskPolicy, isLoading: isLoadingDeskPolicy } = useDeskPolicy({deskId, userId: user.id, resourceType: "notebook"});
  const { handleSectionClick } = useHomeNavigation();
  const { currentSection } = useDeskContext();
  function handleNavigate(section: DeskSection) {
    if(!deskPolicy?.canView) return;
    handleSectionClick(section);
  }
  
  if(isLoading || isLoadingDeskPolicy) return (
    <div className="centered">
      <LoadingState />
    </div>
  )
  if(!desk) return null;
 
  return (
    
    <div className="flex flex-col flex-1">
      <div className="flex flex-[0.3] relative">

        <div style={{
          backgroundSize: "cover",
          backgroundImage: "url(https://i.ibb.co/N6q6BGpt/desk.png)"}} 
          className="absolute inset-0 w-full h-full" 
        />
       
         
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 w-full h-full" />
        
        <div className="absolute text-white px-4 py-2 bottom-0 left-0 flex items-center justify-end w-full">
        
          <AvatarGroup  className="flex items-center text-black">
            {desk.members?.slice(0, 3).map((member) => (
              <span key={member.profile.userId} onClick={e => e.stopPropagation()}>
                <ProfileAvatarWithStatus size="default" profile={member.profile} className="shadow-none"/>
              </span>
            ))}
            {desk.members?.length > 3 &&
              <AvatarGroupCount className="text-foreground size-[20px] bg-secondary-foreground">
                +{desk.members.length - 3}
              </AvatarGroupCount>
            }
          </AvatarGroup>


        </div>
      </div>
      <DeskNavbar onNavigate={handleNavigate} disabled={!deskPolicy?.canView}/>
      <div className="grid grid-cols-1 grid-rows-3 w-full h-full flex-1 gap-2 p-3">
      
        
        <DeskSpaceCard
          selected={currentSection === DeskSection.notebooks}
          label="Notebooks"
          section={DeskSection.notebooks}
          supplies={notebookSupplies}
          onClick={handleNavigate}
          locked={!deskPolicy?.canView}
        />
        

        <DeskSpaceCard
          selected={currentSection === DeskSection.chalkboards}
          label="Chalkboard"
          section={DeskSection.chalkboards}
          supplies={chalkboardSupplies}
          onClick={handleNavigate}
          locked={!deskPolicy?.canView}
        />
      
        <DeskSpaceCard
          label="Study Rooms"
          section={DeskSection.studyRooms}
          supplies={studyRoomsSupplies}
          onClick={() => {}}
          locked={!deskPolicy?.canView}
        />
      </div>
    </div>
  );
}
