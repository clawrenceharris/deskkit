"use client";
import { Column, type ColumnProps } from "./Column";
import { DeskSection, useDeskContext, useHomeNavigation, useLayout, useSchoolContext, useUser } from "@/app/providers";
import { Button, Card, CardDescription, CardTitle } from "@/components/ui";
import { ChevronRight, Loader2, Plus } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { useMediaQuery, useSearch } from "@/hooks";
import { DeskListItem, DeskNavbar } from "../ui";
import type { DeskForCard } from "@/features/desk/infrastructure/queries";
import { useCreateMyDesk, useCreateSchoolDesk, useDesk, useMyDesk, useCreatorDeskCards } from "../../hooks";
import { useModals } from "@/hooks/useModals";
import {  SearchBar } from "@/components/shared";
import { useSchool } from "@/features/school/presentation/hooks";
import { DeskDashboardColumn } from "./DeskDashboardColumn";
import { motion } from "motion/react";
import { Desk } from "@/lib/db/prisma";

type DesksColumnProps = ColumnProps & {
  onDeskClick: (desk: DeskForCard) => void;
}


/**
 * @description A column that displays a list of desks for a user
 * @param onDeskClick - A function that is called when a desk is clicked
 * @param props - The props for the column
 * @returns A column that displays a list of desks for a user
 */
export function DesksColumn ({
  onDeskClick,
  ...props
}: DesksColumnProps) {
  const { user } = useUser();
  const { currentDeskId } = useDeskContext();
  const { data: desks = [], isLoading: isLoadingDesks, error } = useCreatorDeskCards(user.id);

  const { query, search: searchDesks, clearResults, results: filteredDesks, isLoading: isFilteredDesksLoading } = useSearch({
    data: desks,
    filter: (desk, q) => desk.name.toLowerCase().includes(q.toLowerCase()),
  });
  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  // const sortedDesks = useMemo(() => desks.sort((a, b) => b.members.find(member => member.profile.userId === user.id)?.me.getTime() - a.members.find(member => member.profile.userId === user.id)?.createdAt.getTime()), [desks]);
  const { data: currentDesk, isLoading: isLoadingCurrentDesk } = useDesk(currentDeskId);
  const { modals: { "desk:create": createDeskModal, "desk:update": updateDeskModal, "desk:delete": deleteDeskModal }} = useModals();
  const { openLeftLayout, isExpandedMode } = useLayout();
  const { handleSectionClick } = useHomeNavigation();
  async function handleEditDesk(desk: Desk) {
    updateDeskModal.open(desk.id, user.id);
  }
  async function handleDeleteDesk(desk: Desk) {
   
      deleteDeskModal.open(desk.name);
  }
  function handleManageDesk(desk: Desk) {
    console.log(desk);
  }
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
 
 
  if (isLoadingDesks || isLoadingCurrentDesk) {
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
      title={!currentDesk ? "Your Desks" : currentDesk.name}
      showsHeader={!currentDesk || isExpandedMode}
      headerRight={headerRight}
      contentContainerClassName="flex relative flex-col overflow-hidden"
      hideContentOnCollapse={false}
    >  
      {isExpandedMode ? (
         <div className="flex flex-col gap-4 max-h-[500px] my-auto h-full items-center justify-center p-4">
         
        
        <DeskNavbar
          className="flex-1 h-full border-0"
          sections={[DeskSection.home, DeskSection.notebooks, DeskSection.chalkboards, DeskSection.members, DeskSection.settings]}
          showsLabels={false}
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
                  onEditClick={() => handleEditDesk(desk)}
                  onDeleteClick={() => handleDeleteDesk(desk)}
                  onManageClick={() => handleManageDesk(desk)}
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
  const { data: school, isLoading: isLoadingSchool } = useSchool(currentSchoolId);
  const { createSchoolDesk, isLoading: isCreateSchoolDeskLoading } = useCreateSchoolDesk();
  const { createMyDesk, isLoading: isCreateMyDeskLoading } = useCreateMyDesk();
  const { data: myDesk, isLoading: isLoadingMyDesk }  = useMyDesk(user.id)
  
  function handleCreateSchoolDesk() {
    if(!school) return;
    createSchoolDesk(school.id);
  }
  function handleCreateMyDesk() {
    createMyDesk(user.id);
  }
  
  return (

    <>
      {!school?.schoolDesk && !isLoadingSchool && (
        <DeskPlaceholder 
          title="My School Desk" 
          description={`A Desk for ${school?.name ?? "this school"} has not been created yet. Create one to share resources with students in the same school.`} 
          actionLabel="Create My School Desk" 
          isLoading={isCreateSchoolDeskLoading}
          onAction={handleCreateSchoolDesk}
        /> 
      )}

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
