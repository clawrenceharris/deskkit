"use client";
import { useState } from "react";
import { Column, type ColumnProps } from "@/components/shared";
import { DeskDashboardColumn } from "./";
import { DeskSection, useDeskContext, useHomeNavigation, useLayout, useSchoolContext, useUser } from "@/app/providers";
import { Button, Card, CardDescription, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";
import { ChevronDown, ChevronLeft, ChevronRight, Loader2, LogOut, Plus, Settings, Trash2 } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { useMediaQuery, useSearch } from "@/hooks";
import { DeskListItem, DeskNavbar } from "../ui";
import { useCreateMyDesk, useCreateSchoolDesk, useDesk, useMyDesk, useSchoolDeskDetail, useDeskPolicy } from "../../hooks";
import { useModals } from "@/hooks/useModals";
import { SearchBar } from "@/components/shared";
import { useSchool } from "@/features/school/presentation/hooks";
import { motion } from "motion/react";
import { useJoinedDesksCard, useDeleteDesk, useJoinOrLeaveDesk } from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { deskKeys } from "@/lib/queries";
import { Desk } from "@/features/desk/infrastructure/queries";
import { toast } from "sonner";

type DesksColumnProps = ColumnProps & {
  onDeskClick: (desk: Desk) => void;
}


/**
 * @description A column that displays a list of desks for a user
 * @param onDeskClick - A function that is called when a desk is clicked
 * @param props - The props for the column
 * @returns A column that displays a list of desks for a user
 */
export function DesksColumn ({
  onDeskClick,
  onCollapse,
  ...props
}: DesksColumnProps) {
  const { user } = useUser();
  const { currentDeskId } = useDeskContext();
  const { data: desks = [], isLoading: isLoadingDesks, error } = useJoinedDesksCard(user.id);

  const { query, search: searchDesks, clearResults, results: filteredDesks, isLoading: isFilteredDesksLoading } = useSearch({
    data: desks,
    filter: (desk, q) => desk.name.toLowerCase().includes(q.toLowerCase()),
  });
  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  const { data: currentDesk, isLoading: isLoadingCurrentDesk } = useDesk(currentDeskId);
  const { modals: { 
    "desk:create": createDeskModal,
    "desk:update": updateDeskModal, 
    "confirmation": confirmationModal
  }} = useModals();
  const { openLeftLayout, isExpandedMode, isRightLayout } = useLayout();
  const { handleSectionClick } = useHomeNavigation();
  const { leaveDesk } = useJoinOrLeaveDesk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: policy, isLoading: isLoadingDeskPolicy } = useDeskPolicy({deskId: currentDeskId, userId: user.id});
  const { deleteDesk } = useDeleteDesk();
  
  
  async function handleLeaveDesk(desk: Desk) {
    confirmationModal.open({
      title: "Leave Desk",
      description: "Are you sure you want to leave this desk?",
      onConfirm: () => {
        leaveDesk({deskId: desk.id, userId: user.id});
      }
    });
  }
  async function handleEditDesk(desk: Desk) {
    updateDeskModal.open(desk.id, user.id);
  }
  async function handleDeleteDesk(desk: Desk) {
   
      confirmationModal.open({
        title: "Delete Desk",
        description: "Are you sure you want to delete this desk?",
        onConfirm: () =>{
          if(policy && policy.canDelete) {
            deleteDesk(desk.id);
          }
          else {
            toast.error("You do not have permission to delete this desk");
          }
        }
      });
  }
  function handleManageDesk() {
    handleSectionClick(DeskSection.settings);
  }
  const renderDeskTitle = () => (

    currentDesk ?( 
    
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger
         asChild>
       <div 
       onContextMenu={(e) => {
        e.preventDefault();
        setIsMenuOpen(true);
      }}
       className="flex flex-1">

     
          <Button
            className="flex items-center hover:shadow-sm border border-muted-foreground/20 bg-muted/40 gap-2 justify-between flex-1  hover:bg-muted rounded-md"
            variant="ghost"
            size="sm"
            onClick={() => onDeskClick(currentDesk)}
          >
            <span title={currentDesk.name} className="truncate max-w-[270px]">
              {currentDesk.name}
            </span>
            <ChevronDown strokeWidth={3} />
          </Button>
          </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleManageDesk}>
          <Settings />
          Manage Desk
        </DropdownMenuItem>
        {currentDesk.creatorId === user.id && (
          <DropdownMenuItem variant="destructive" onClick={() => handleDeleteDesk(currentDesk)}>
            <Trash2 />
            Delete Desk
          </DropdownMenuItem>
        )}
        <DropdownMenuItem variant="destructive" onClick={() => handleLeaveDesk(currentDesk)}>
          <LogOut />
          Leave Desk
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    ) : ( 
    <h2 className="text-lg font-semibold">Your Desks</h2> 
    )
  )
  const headerRight = (
  
    <div className="flex items-center gap-2">
      <SearchBar
        placeholder="Search desks"
        expandedWidthClassName="w-47"
        onChange={searchDesks}
        value={query}
      />
      <Button
        onClick={() => createDeskModal.open(user.id)}
        size="icon"
        variant="primary"
      >
        <Plus strokeWidth={3}/>
      </Button>
    </div>
    );
  
  
  if(query && isFilteredDesksLoading) {
    return (
      <Column {...props}>
        <div className="centered">
          <LoadingState />
        </div>
      </Column>
    );
  }
 
 
  if (isLoadingDesks || isLoadingCurrentDesk || isLoadingDeskPolicy) {
    return (
      <Column {...props}>
        <div className="centered">
          <LoadingState />
        </div>
      </Column>
    );
  }
  if(error) {
    return (
      <Column {...props}>
        <div className="h-full flex-1 flex items-center justify-center">
          <ErrorState message={error.message} />
        </div>
      </Column>
    );
  }
  
  return (
    <Column 
      {...props}
      title={isExpandedMode || isRightLayout ? undefined : renderDeskTitle()}
      headerRight={!currentDesk ? headerRight : undefined}
      contentContainerClassName="flex relative flex-col overflow-hidden"
      hideContentOnCollapse={false}
      toggle={
        isExpandedMode || isRightLayout ? (
        <Button variant="ghost" size="icon" onClick={onCollapse}>
          <ChevronRight strokeWidth={3}/>
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={onCollapse}>
          <ChevronLeft strokeWidth={3}/>
        </Button>
      )}
    >  
      {isExpandedMode || isRightLayout ? (
        <div className="flex flex-col gap-4 h-full max-h-[400px] my-auto items-center justify-between p-4">
          <DeskNavbar
            className="flex-1 h-full border-0"
            sections={[DeskSection.home, DeskSection.notebooks, DeskSection.chalkboards, DeskSection.members]}
            showsLabels={false}
            disabled={!policy || !policy.canView}
            onNavigate={handleSectionClick}
            orientation="vertical"
          />
        </div>
      ) : (
       <> 
      <motion.div
        initial={false}
        className="absolute inset-0 flex flex-col overflow-hidden"

        animate={{ x: !currentDeskId ? "0%" : "-100%" }}
        transition={{
          duration: 0.35,
          ease: [0.32, 0.72, 0, 1] as const,
        }}
      >
       
      
        {query && filteredDesks.length === 0 ? ( 
          <div className="centered">
            <EmptyState 
              title="No desks found" 
              message="Your search didn't match any desks." 
              onAction={clearResults} 
              actionLabel="Clear search" 
              buttonVariant="outline"

            /> 
          </div>
        ) : ( 
          <div className="flex flex-col gap-4 h-full  overflow-y-auto p-4">
            
            <PlaceholderDesks />
            {(query ? filteredDesks : desks).map((desk) => (

                <DeskListItem
                  onLeaveClick={() => handleLeaveDesk(desk)}
                  onEditClick={() => handleEditDesk(desk)}
                  onDeleteClick={() => handleDeleteDesk(desk)}
                  onManageClick={handleManageDesk}
                  onClick={onDeskClick}
                  selected={desk.id === currentDeskId}
                  key={desk.id}
                  desk={desk}
                />

            ))}
          </div>
        )}
      </motion.div>
     
      
      <motion.div
        className="absolute inset-0 flex flex-col overflow-hidden"
        initial={false}
        animate={{ x: currentDeskId ? "0%" : "100%" }}
        transition={{
          duration: 0.35,
          ease: [0.32, 0.72, 0, 1] as const,
        }}
      >
       {currentDesk ? <DeskDashboardColumn
          deskId={currentDesk.id}
        />
       :
       isMobile ? <EmptyState
        title="No desk selected" 
        variant="card"
        message="Select a desk to view its dashboard."
        onAction={openLeftLayout}
        actionLabel="Go to desks"
        buttonVariant="outline"
        buttonIcon={<ChevronRight strokeWidth={3}/>}
       />
       : null
      
      }
      </motion.div>
        
        </>
      )}
    </Column>
  );
}
type DeskPlaceholderProps = {
  title: string;
  actionLabel: string;
  onAction: () => void;
  description: string;
  isLoading: boolean;
}


function PlaceholderDesks(){
  const { currentSchoolId } = useSchoolContext();
  const { user } = useUser();
  const { data: school } = useSchool(currentSchoolId);
  const { createSchoolDesk, isLoading: isCreateSchoolDeskLoading } = useCreateSchoolDesk();
  const { createMyDesk, isLoading: isCreateMyDeskLoading } = useCreateMyDesk();
  const { data: myDesk, isLoading: isLoadingMyDesk }  = useMyDesk(user.id);
  const { data: schoolDesk, isLoading: isLoadingSchoolDesk }  = useSchoolDeskDetail(currentSchoolId);
  const { joinDesk, isJoining } = useJoinOrLeaveDesk();
  const queryClient = useQueryClient();
  function handleJoinSchoolDesk() {
    if(!school || !school.schoolDesk) return;
    joinDesk({deskId: school.schoolDesk.desk.id, userId: user.id, role: "CONTRIBUTOR"}).then(() => {
      queryClient.invalidateQueries({ queryKey: deskKeys.schoolDesk(currentSchoolId ?? "", "detail") });

    });
  }
  function handleCreateSchoolDesk() {
    if(!school) return;
    createSchoolDesk(school.id);
  }
  function handleCreateMyDesk() {
    createMyDesk(user.id);
  }
  
  return (

    <>
      {school && !schoolDesk && !isLoadingSchoolDesk ? (
        <DeskPlaceholder 
          title="My School Desk" 
          description={`A Desk for ${school.name} has not been created yet. Create one to share resources with students in the same school.`} 
          actionLabel="Create My School Desk" 
          isLoading={isCreateSchoolDeskLoading}
          onAction={handleCreateSchoolDesk}
        /> 
      ) : 
      
      school && schoolDesk && !schoolDesk.members.some(m => m.profile.userId === user.id) && !isLoadingSchoolDesk ? (
        <DeskPlaceholder 
          title={schoolDesk.name}
          description={`You are not a member of ${school.name}'s official Desk yet. Join now to collaborate with students in this school.`} 
          actionLabel="Join School Desk" 
          isLoading={isJoining}
          onAction={handleJoinSchoolDesk}
        /> 
        ) : null }

      {!myDesk && !isLoadingMyDesk && (
      
        <DeskPlaceholder 
          title="My Desk" 
          description="'My Desk' is a personal desk just for you. Create one to organize your private resources." 
          actionLabel="Create My Desk" 
          onAction={handleCreateMyDesk} 
          isLoading={isCreateMyDeskLoading}
        /> 
      )}
      
    
    
    </>
  )
}
function DeskPlaceholder({title, description, actionLabel, onAction, isLoading}: DeskPlaceholderProps) {
  return (
    <Card
    aria-disabled={isLoading}
      className={`
        border-dashed border-2 border-secondary/30 hover:border-secondary/60
        relative
        flex flex-col justify-center
        bg-secondary/5 hover:bg-secondary/10
        w-full max-w-[400px] 
        outline-0
        mx-auto px-4
        h-auto
        min-h-[250px]
        transition-all duration-200
        box-shadow 
        cursor-pointer 
        rounded-xl
        group`}  
    >
       
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm whitespace-normal max-w-[280px] leading-relaxed">
            {description}
          </CardDescription>
        <Button 
          variant="secondary" 
          className="mt-2 group-hover:bg-secondary/80 transition-colors" 
          disabled={isLoading}
          onClick={onAction}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : actionLabel}
        </Button>
    </Card>
  );
}
