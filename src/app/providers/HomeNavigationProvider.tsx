"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeskContext, useLayout } from "@/app/providers";
import type { Notebook } from "@/features/notebook/infrastructure/queries";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const APP_ROUTES = {
  desks: "/desks",
  desk: (deskId: string) => `/desks/${deskId}`,
  notebook: (deskId: string, notebookId: string) => `/desks/${deskId}/notebooks/${notebookId}`,
  notebooks: (deskId: string) => `/desks/${deskId}/notebooks`,
  studyRooms: (deskId: string) => `/desks/${deskId}/study-rooms`,
  burningQuestions: (deskId: string) => `/desks/${deskId}/burning-questions`,
  deskMembers: (deskId: string) => `/desks/${deskId}/members`,
  chalkboard: (deskId: string) => `/desks/${deskId}/chalkboards`,
  settings: (deskId: string) => `/desks/${deskId}/settings`,
  notifications: (deskId: string) => `/desks/${deskId}/notifications`,
} as const;

export const RIGHT_MODES = {
  profile: "pf",
  notebook: "notebook",
} as const;

export const PROFILE_ORIGINS = {
  notebook: "notebook",
  direct: "direct",
} as const;

export const PANELS = {
  left: "l",
  center: "c",
  right: "r",
} as const;

export type ProfileOrigin = keyof typeof PROFILE_ORIGINS;
export enum DeskSection {
  home = "home",
  notebooks = "notebooks",
  chalkboards = "chalkboards",
  burningQuestions = "burning-questions",
  studyRooms = "study-rooms",
  members = "members",
  settings = "settings",
}

type HomeNavigationContextType = {
  materialIndex: number;
  setMaterialIndex: (index: number) => void;
  handleNotebookClick: (notebook: Notebook) => void;
  handleDeskClick: (deskId: string) => void;
  handleDesksOpen: () => void;
  handleDeskExit: () => void;
  handleSectionClick: (section: DeskSection) => void;
  handleNotebookExit: () => void;
  handleExpandLayout: () => void;
  handleExitExpandedLayout: () => void;
  navigateTo: (path: string) => void;
  };

const HomeNavigationContext = createContext<HomeNavigationContextType | undefined>(undefined);

type HomeNavigationProviderProps = {
  children: React.ReactNode;
};

function getRouteState(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const [root, deskId, section, notebookId] = segments;

  if (root !== "desks") {
    return {
      deskId: null,
      notebookId: null,
      section: null,
      hasRightPanel: false,
    };
  }

  function getSection(section: string) {
   
    if(section === DeskSection.notebooks) {
      return DeskSection.notebooks;
    }
    if(section === DeskSection.chalkboards) {
      return DeskSection.chalkboards;
    }
    if(section === DeskSection.burningQuestions) {
      return DeskSection.burningQuestions;
    }
    if(section === DeskSection.studyRooms) {
      return DeskSection.studyRooms;
    }
    if(section === DeskSection.settings) {
      return DeskSection.settings;
    }
    if(section === DeskSection.members) {
      return DeskSection.members;
    }
    return null;
  }

  return {
    deskId: deskId ?? null,
    notebookId: section === DeskSection.notebooks ? notebookId ?? null : null,
    section: getSection(section),
    hasRightPanel: section === DeskSection.notebooks && !!notebookId,
  };
}

export function HomeNavigationProvider({ children }: HomeNavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [materialIndex, setMaterialIndex] = useState(0);
  const {currentDeskId, setCurrentDeskId, setCurrentNotebookId, setCurrentSection } = useDeskContext();
  const {
    openLeftLayout,
    closeRightLayout,
    openExpandedLayout,
    openRightLayout,
    openDeskLayout
  } = useLayout();
  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  /**
   * Sets the current section based on the route state.
   */
  useEffect(() => {
    const route = getRouteState(pathname);
    if (route.section) {
      setCurrentSection(route.section);
    }
    else if (route.deskId) {
      setCurrentSection(DeskSection.home);
    } 
  }, [pathname, setCurrentSection]);
  

  
  /**
   * Sets the current desk and notebook id based on the route state and opens the appropriate layout.
   */
  useEffect(() => {
    const route = getRouteState(pathname);
    setCurrentDeskId(route.deskId);
    setCurrentNotebookId(route.notebookId);
    if(route.notebookId) {
      openRightLayout();
      return;

    }
    if(route.section && isMobile){
      openDeskLayout();
      return;
    }
    if(route.deskId) {
      openLeftLayout();
    }
  }, [isMobile, openDeskLayout, openLeftLayout, openRightLayout, pathname, setCurrentDeskId, setCurrentNotebookId]);
  /**
   * Navigates to the given path with the current search params.
   */
  const navigateTo = useCallback((path: string) => {
    const params = new URLSearchParams(searchParams);
    router.push(`${path}?${params.toString()}`);
  }, [router, searchParams]);
  
  const handleSectionClick = useCallback((section: DeskSection) => {
    if(!currentDeskId) {
      return;
    }
    if(section === DeskSection.chalkboards) {
      navigateTo(APP_ROUTES.chalkboard(currentDeskId));
      return;
    }
    if(section === DeskSection.notebooks) {
      navigateTo(APP_ROUTES.notebooks(currentDeskId));
      return;
    }
    if(section === DeskSection.burningQuestions) {
      navigateTo(APP_ROUTES.burningQuestions(currentDeskId));
      return;
    }
    if(section === DeskSection.studyRooms) {
      navigateTo(APP_ROUTES.studyRooms(currentDeskId));
      return;
    }
    if(section === DeskSection.home) {
      navigateTo(APP_ROUTES.desk(currentDeskId));
      return;
    }
    if(section === DeskSection.members) {
      navigateTo(APP_ROUTES.deskMembers(currentDeskId));
      return;
    }
    if(section === DeskSection.settings) {
      navigateTo(APP_ROUTES.settings(currentDeskId));
      return;
    }
    

  }, [currentDeskId, navigateTo]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const expanded = params.get("expanded") === "true";
    if(expanded) {
      openExpandedLayout();
    }
  }, [openExpandedLayout, searchParams]);

  const handleNotebookClick = useCallback((notebook: Notebook) => {
    setMaterialIndex(0);

    navigateTo(APP_ROUTES.notebook(notebook.deskId, notebook.id));

  }, [navigateTo]);

  const handleDeskClick = useCallback((deskId: string) => {
    setMaterialIndex(0);
    setCurrentDeskId(deskId);
    setCurrentNotebookId(null);
    openLeftLayout(); 
    navigateTo(APP_ROUTES.desk(deskId));
  }, [navigateTo, openLeftLayout, setCurrentDeskId, setCurrentNotebookId]);

  const handleDesksOpen = useCallback(() => {
    openLeftLayout();
  }, [openLeftLayout]);

  const handleExitExpandedLayout = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (params.get("expanded") === "true") {
      params.delete("expanded");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [router, pathname, searchParams]);
  
  const handleExpandLayout = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (params.get("expanded") !== "true") {
      params.set("expanded", "true");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [router, pathname, searchParams]);
  
  const handleDeskExit = useCallback(() => {
    setCurrentDeskId(null);
    setCurrentNotebookId(null);
    setMaterialIndex(0);
    openLeftLayout();
    setCurrentSection(null);
    navigateTo(APP_ROUTES.desks);
  }, [navigateTo, openLeftLayout, setCurrentDeskId, setCurrentNotebookId, setCurrentSection]);

  const handleNotebookExit = useCallback(() => {
    if(!currentDeskId) {
      return;
    }
    setCurrentNotebookId(null);
    closeRightLayout();
    navigateTo(APP_ROUTES.notebooks(currentDeskId));
  }, [closeRightLayout, currentDeskId, navigateTo, setCurrentNotebookId]);

  const contextValue = useMemo(() => ({
    materialIndex,
    setMaterialIndex,
    handleNotebookClick,
    handleNotebookExit,
    handleDeskClick,
    handleDesksOpen,
    handleDeskExit,
    handleSectionClick,
    handleExpandLayout,
    handleExitExpandedLayout,
    navigateTo
  }), [
    materialIndex,
    setMaterialIndex,
    handleNotebookClick,
    handleNotebookExit,
    handleDeskClick,
    handleDesksOpen,
    handleDeskExit,
    handleSectionClick,
    handleExpandLayout,
    handleExitExpandedLayout,
    navigateTo
  ]);

  return (
    <HomeNavigationContext.Provider value={contextValue}>
      {children}
    </HomeNavigationContext.Provider>
  );
}

export function useHomeNavigation() {
  const context = useContext(HomeNavigationContext);
  if (!context) {
    throw new Error("useHomeNavigation must be used within a HomeNavigationProvider");
  }
  return context;
}
