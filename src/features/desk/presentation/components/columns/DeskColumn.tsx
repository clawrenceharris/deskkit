"use client";
import { Column, type ColumnProps } from "./Column";
import { Notebook, Plus } from "lucide-react";
import { EmptyState, LoadingState } from "@/components/states";
import { DeskSection, useDeskContext, useUser } from "@/app/providers";
import type { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { useDeskDetail, useDeskPolicy } from "../../hooks";
import { DeskForCard, DeskForDetail } from "@/features/desk/infrastructure/queries";
import { useJoinOrLeaveDesk } from "../../hooks/useJoinOrLeaveDesk";
import { ChalkboardsView, ComingSoonView, DeskHomeView, NotebooksView } from "../views";
import { Icon } from "@/components/shared";
import chalkboardIcon from "@/assets/chalkboard-icon.png";
import deskIcon from "@/assets/desk-icon.png";
import notebookIcon from "@/assets/notebook-icon.png";
import { StaticImageData } from "next/image";
interface DeskColumnProps extends ColumnProps {
  onNotebookClick: (notebook: NotebookForDetail) => void;
  onDeskClick: (desk: DeskForCard) => void;
}

export function DeskColumn ({
  onNotebookClick,
  ...props
}: DeskColumnProps) {
  const { currentSection, currentDeskId: deskId } = useDeskContext();
  const {data: desk, isLoading: isLoadingDesk} = useDeskDetail(deskId);
  const { user, profile } = useUser();
  const { joinDesk, leaveDesk, isJoining, isLeaving } = useJoinOrLeaveDesk();
  const { data: deskPolicy, isLoading: isLoadingDeskPolicy } = useDeskPolicy({deskId, userId: user.id, schoolId: profile.schoolId});
  
  
  function handleJoinSchoolDesk() {
    if(!deskId) return;
    joinDesk({deskId, userId: user.id, role: "CONTRIBUTOR"});
  }
  
  function handleLeaveSchoolDesk() {
    if(!deskId) return;
    leaveDesk({deskId, userId: user.id});
  }

  const renderDeskView = (desk: DeskForDetail) => {
   
    switch(currentSection) {
      
      case DeskSection.notebooks:
        return (
          <NotebooksView
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
          <ComingSoonView
            title="Settings"
            {...props}
          />
      );
      case DeskSection.members:
        return (
          <ComingSoonView
            title="Members"
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
  const secondaryButtonLabel = isMember && canJoin ? "Remove desk" : undefined;
  const secondaryButtonVariant = isMember && canJoin ? "destructive" : "outline";
  const primaryAction = canJoin ? handleJoinSchoolDesk : isMember ? handleLeaveSchoolDesk : undefined;
  const primaryButtonLabel = canJoin ? "Join desk" : isMember ? "Leave desk" : "Join desk";
  if(!deskPolicy?.canView){
    return (
      <Column title={desk.name} {...props}>
        <div className="h-full flex-1 flex items-center justify-center">
          <EmptyState 
            variant="card" imageUrl="https://i.ibb.co/H87K7h0/desk.png" 
            message="You do not have permission to view this Desk." 
            buttonVariant={"tertiary" }
            onAction={primaryAction} 
            actionLabel={primaryButtonLabel}
            isLoadingAction={isJoining}
            secondaryButtonVariant={secondaryButtonVariant}
            onSecondaryAction={secondaryAction}
            isLoadingSecondaryAction={isMember ? isLeaving : undefined}
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
    <span className="text-md bg-primary text-white font-semibold rounded-full px-2 py-1 flex items-center gap-2">
      <Icon src={icon} alt={title} className="size-5 invert"/>
      {title}
    </span>
  )
}


