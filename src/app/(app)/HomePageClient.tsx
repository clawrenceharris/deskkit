"use client";
import { useDeskContext, useLayout } from "@/app/providers";
import { useMediaQuery } from "@/hooks";
import { DesksColumn, DeskColumn } from "@/features/desk/presentation/components/columns";
import { NotebookColumn } from "./_components";
import { AnimatePresence } from "motion/react";
import { useHomeNavigation } from "@/app/providers";
import { useEffect } from "react";
import { RootHeader } from "@/components/shared/RootHeader";
import { startUiProfiler, stopUiProfiler } from "@/instrumentation";

export function HomePageClient() {
  const {
    currentDeskId,
  } = useDeskContext();
  const { isColumnOpen, isRightLayout } = useLayout();
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
  useEffect(() =>{
    startUiProfiler("HomePageClient");
    return () => {
      stopUiProfiler("HomePageClient");
    }
  }, []);
  return (
    <div className="page"> 
      <RootHeader />
      <main className="bg-muted rounded-3xl border">
      <AnimatePresence mode="popLayout">
        {isColumnOpen("left") && isMobile && 
          <DesksColumn
            openWidth={"100%"}
            closedWidth={0}
            onCollapse={handleDesksCollapse}
            onOpen={handleDesksOpen}
            onDeskClick={(desk) => handleDeskClick(desk.id)}
            columnType={"left"}
          /> }
        {!isMobile && 
        
          <DesksColumn
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
            openWidth={"100%"}
            style={{borderLeft: isMobile ? "none" : "1px solid var(--border)"}}
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
              materialIndex={materialIndex}
              style={{borderLeft: isMobile ? "none" : "1px solid var(--border)"}}

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