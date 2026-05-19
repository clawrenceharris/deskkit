"use client";
import { ProfileButton } from "@/components/shared";
import { AvatarGroup, AvatarGroupCount, Button } from "@/components/ui";
import { useDeskDetail } from "../../hooks/useDesk";
import {  LoadingState } from "@/components/states";
import { DeskNavbar } from "../ui/DeskNavbar";
import { useDeskPolicy } from "../../hooks";
import { DeskSection, useDeskContext, useHomeNavigation, useSchoolContext, useUser } from "@/app/providers";
import { ChevronLeft } from "lucide-react";
import { DeskSectionCard } from "../ui";
import { chalkboardSupplies, notebookSupplies, studyRoomsSupplies } from "@/lib/constants";

type DeskDetailsColumnProps = {
    deskId: string;
}

export function DeskDashboardColumn({deskId}: DeskDetailsColumnProps) {
  const { data: desk, isLoading } = useDeskDetail(deskId);
  const { user } = useUser();
  const { currentSchoolId } = useSchoolContext();
  const { data: deskPolicy, isLoading: isLoadingDeskPolicy } = useDeskPolicy({deskId, userId: user.id, schoolId: currentSchoolId, resourceType: "notebook"});
  const { handleDeskExit } = useHomeNavigation();
  const { handleSectionClick } = useHomeNavigation();
  const { currentSection } = useDeskContext();
  console.log("desk", desk);
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
        <Button className="absolute top-3 left-3 text-white bg-black/50 hover:bg-black/30  rounded-full" variant="ghost" size="icon" onClick={handleDeskExit}>
            <ChevronLeft strokeWidth={3}/>
        </Button>
        <div className="absolute text-white px-4 py-2 bottom-0 left-0 flex items-center justify-between w-full">
          <p>{desk.name}</p>
        
          <AvatarGroup  className="flex items-center text-black">
            {desk.members?.slice(0, 3).map((member) => (
              <span key={member.profile.userId} onClick={e => e.stopPropagation()}>
                <ProfileButton tabIndex={-1} disabled size="icon-sm" profile={member.profile} />
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
      <DeskNavbar onNavigate={handleNavigate}/>
      <div className="grid grid-cols-1 grid-rows-3 w-full h-full flex-1 gap-2 p-3">
      
        
        <DeskSectionCard
          selected={currentSection === DeskSection.notebooks}
          label="Notebooks"
          section={DeskSection.notebooks}
          supplies={notebookSupplies}
          onClick={handleNavigate}
        />
        

        <DeskSectionCard
          selected={currentSection === DeskSection.chalkboards}
          label="Chalkboard"
          section={DeskSection.chalkboards}
          supplies={chalkboardSupplies}
          onClick={handleNavigate}
        />
      
        <DeskSectionCard
          label="Study Rooms"
          section={DeskSection.studyRooms}
          supplies={studyRoomsSupplies}
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
