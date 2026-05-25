"use client";
import { Column, type ColumnProps } from "./Column";
import { Plus } from "lucide-react";
import { EmptyState, LoadingState } from "@/components/states";
import { DeskSection, useDeskContext, useUser } from "@/app/providers";
import type { NotebookForCard } from "@/features/notebook/infrastructure/queries";
import { useDeskDetail, useDeskPolicy } from "../../hooks";
import { Desk, DeskForDetail } from "@/features/desk/infrastructure/queries";
import { useJoinOrLeaveDesk } from "../../hooks/useJoinOrLeaveDesk";
import { ChalkboardsView, ComingSoonView, DeskHomeView, DeskMembersView, DeskNotebooksView, DeskSettingsView } from "../views";
import { Icon } from "@/components/shared";
import chalkboardIcon from "@/assets/chalkboard.png";
import deskIcon from "@/assets/desk.png";
import notebookIcon from "@/assets/notebook.png";
import { StaticImageData } from "next/image";
import gearIcon from "@/assets/gear.png";
import { startUiProfiler, stopUiProfiler } from "@/instrumentation";
import { useEffect } from "react";
interface DeskColumnProps extends ColumnProps {
  onNotebookClick: (notebook: NotebookForCard) => void;
  onDeskClick: (desk: Desk) => void;
}

export function DeskColumn ({
  onNotebookClick,
  ...props
}: DeskColumnProps) {
  const { currentSection, setCurrentDeskId, currentDeskId: deskId } = useDeskContext();
  const {data: desk, isLoading: isLoadingDesk} = useDeskDetail(deskId);
  const { user } = useUser();
  const { joinDesk, leaveDesk, isJoining, isLeaving } = useJoinOrLeaveDesk();
  const { data: deskPolicy, isLoading: isLoadingDeskPolicy } = useDeskPolicy({deskId, userId: user.id});
  
  
  function handleJoinSchoolDesk() {
    if(!deskId) return;
    joinDesk({deskId, userId: user.id, role: "CONTRIBUTOR"});
  }
  
  function handleLeaveSchoolDesk() {
    if(!deskId) return;
    leaveDesk({deskId, userId: user.id}).then(() => {
      setCurrentDeskId(null);
    });
  }
  useEffect(() => {
    startUiProfiler("DeskColumn");
    return () => {
      stopUiProfiler("DeskColumn");
    };
  }, []);
  const renderDeskView = (desk: DeskForDetail) => {
   
    switch(currentSection) {
      
      case DeskSection.notebooks:
        return (
          <DeskNotebooksView
            desk={desk}
            title={<DeskTitle 
              icon={notebookIcon}
              title="Notebooks" /> }
              onNotebookClick={onNotebookClick}
              {...props}

          />
        );
      case DeskSection.chalkboards:
        return (
          <ChalkboardsView
          title={<DeskTitle 
            icon={chalkboardIcon}
            title="Chalkboards" /> }
            desk={desk}
            {...props}
          />
        );
      case DeskSection.burningQuestions:
        return (
          <ComingSoonView
            title="Burning Questions"
            {...props}
          />
        );
      case DeskSection.studyRooms:
        return (
          <ComingSoonView
            title="Study Rooms"
            {...props}
          />
      );
     
      case DeskSection.settings:
        return (
          <DeskSettingsView
            desk={desk}
            title={<DeskTitle 
              icon={gearIcon}
              title="Settings" /> }
            {...props}
          />
        );
      case DeskSection.members:
        return (
          <DeskMembersView
            desk={desk}
            {...props}
          />
      );
     
      default:
        return (
          <DeskHomeView 
          title={<DeskTitle 
            icon={deskIcon}
            title="Home" /> }
          
          desk={desk} {...props} />
        )
    }
  };

 

  
  if(!deskId){
    return (
      <Column toggle={<></>} {...props}>
        <div className="centered">  
          <EmptyState 
            title="Nothing to see here..." 
            variant="card"
            imageUrl="https://i.ibb.co/H87K7h0/desk.png"
            message="Select a Desk on the left to see its contents or create a new one" 
            buttonVariant="tertiary"
            buttonIcon={<Plus strokeWidth={3}/>}
          />
        </div>
      </Column>
    );
  }
  if (isLoadingDesk || isLoadingDeskPolicy) {
    return (
      <Column {...props}>
        <div className="centered">
          <LoadingState />
        </div>
      </Column>
    );
  }
  if (!desk) {
    return (
      <Column {...props}>
        <div className="centered">  
          <EmptyState 
            title="Desk Not Found" 
            variant="card"
            imageUrl="https://i.ibb.co/H87K7h0/desk.png"
            message="The desk you are looking for does not exist or has been deleted." 
            buttonVariant="tertiary"
            buttonIcon={<Plus strokeWidth={3}/>}
          />
        </div>
      </Column>
    );
  }
  const isMember = desk.members.some(member => member.profile.userId === user.id);
  const canJoin = deskPolicy?.canJoin ?? false;
  const secondaryAction = isMember && canJoin ? handleLeaveSchoolDesk : undefined;
  const secondaryButtonLabel = isMember && canJoin ? "Leave" : undefined;
  const secondaryButtonVariant = isMember && canJoin ? "destructive" : "outline";
  const primaryAction = canJoin ? handleJoinSchoolDesk : isMember ? handleLeaveSchoolDesk : undefined;
  const primaryButtonLabel = canJoin ? "Join Desk" : isMember ? "Leave" : "Join Desk";
  if(!deskPolicy?.canView){
    return (
      <Column showsHeader={false} {...props}>
        <div className="h-full flex-1 flex items-center justify-center">
          <EmptyState 
            variant="card" imageUrl="https://i.ibb.co/H87K7h0/desk.png" 
            message="You don't have permission to view this Desk at the moment." 
            buttonVariant={"tertiary" }
            onAction={primaryAction} 
            actionLabel={primaryButtonLabel}
            isLoadingAction={primaryButtonLabel === "Join Desk" ? isJoining : isLeaving}
            secondaryButtonVariant={secondaryButtonVariant}
            onSecondaryAction={secondaryAction}
            isLoadingSecondaryAction={secondaryButtonLabel ? isLeaving : undefined}
            secondaryActionLabel={secondaryButtonLabel}
          />
        </div>
      </Column>
    );
  }
   
  return renderDeskView(desk)
}

type DeskTitleProps = {
  title: string;
  icon: StaticImageData;
}


function DeskTitle({title, icon}: DeskTitleProps) {
  return (
    <span className="text-md bg-muted border font-semibold rounded-full px-2 py-1 flex items-center gap-2">
      <Icon src={icon} alt={title} className="size-7"/>
      {title}
    </span>
  )
}


