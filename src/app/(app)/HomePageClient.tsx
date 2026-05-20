"use client";
import { useDeskContext, useLayout } from "@/app/providers";
import { useMediaQuery } from "@/hooks";
import { DesksColumn, DeskColumn } from "@/features/desk/presentation/components/columns";
import { NotebookColumn } from "./_components";
import { AnimatePresence } from "motion/react";
import { useHomeNavigation } from "@/app/providers";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { RootHeader } from "@/components/shared/RootHeader";

export function HomePageClient() {
  const {
    currentDeskId,
  } = useDeskContext();
  const { isColumnOpen, isRightLayout } = useLayout();
  const isRightMode = useMemo(() => isColumnOpen("right"), [isColumnOpen]);
  const {  
    materialIndex,
    setMaterialIndex,
    handleNotebookClick,
    handleDeskClick,
    handleDesksOpen,
    handleDeskExit,
    handleNotebookExit,
    handleExpandLayout,
    handleExitExpandedLayout,
  } = useHomeNavigation();
  const { isExpandedMode } = useLayout();
  function handleDesksCollapse(e: React.MouseEvent<HTMLButtonElement>) {
   
    if(currentDeskId ) {
      e.preventDefault();
    }
    handleDeskExit();
  }
  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  
  function handleDeskCollapse(e: React.MouseEvent<HTMLButtonElement>) {
    if(isMobile) {
      handleDesksOpen();
      return;
    }
    e.preventDefault();
    if(isExpandedMode) {
      handleExitExpandedLayout();
      return;
    }
    handleExpandLayout();
    
  }

  return (
    <div className="page"> 
      <RootHeader />
      <main>
    <AnimatePresence mode="popLayout">
      {isColumnOpen("left") && isMobile && 
        <DesksColumn
          className="border"
          openWidth={"100%"}
          closedWidth={0}
          onCollapse={handleDesksCollapse}
          onOpen={handleDesksOpen}
          onDeskClick={(desk) => handleDeskClick(desk.id)}
          columnType={"left"}
        /> }
      {!isMobile && 
      
        <DesksColumn
          className="border rounded-r-none"
          openWidth={400}
        
          closedWidth={70}
          collapsable={false}
          onOpen={handleDesksOpen}
          onCollapse={handleDesksCollapse}
          onDeskClick={(desk) => handleDeskClick(desk.id)}
          columnType={"left"}
        /> }
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
         
        <DeskColumn
          className={cn("border rounded-l-none border-l-0", isRightMode ? "rounded-none" : "")}
          openWidth={"100%"}
          closedWidth={isMobile ? 0 : 55}
          onCollapse={handleDeskCollapse}
          onNotebookClick={handleNotebookClick}
          columnType={"center"}
          onDeskClick={(desk) => handleDeskClick(desk.id)}
        />
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {isRightLayout && 
          <NotebookColumn 
            className="border rounded-l-none border-l-0"
            materialIndex={materialIndex}
            onMaterialIndexChange={setMaterialIndex}
            closedWidth={0}
            onCollapse={handleNotebookExit}
            openWidth={isMobile ? "100%" : 450}
            
            columnType={"right"}
          />}
      </AnimatePresence>
    
       
    </main>
    </div>
  );
};