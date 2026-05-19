/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useMediaQuery } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
export type ColumnType = "left" | "center" | "right";
export type RightPanelMode = "notebook" | "profile";

interface LayoutProviderProps {
  children: React.ReactNode;
  initialColumns?: ColumnType[];
}
interface LayoutContextType {
  openRightLayout: () => void;
  isColumnOpen: (columnType: ColumnType) => boolean;
  openColumn: (columnType: ColumnType) => void;
  closeColumn: (columnType: ColumnType) => void;
  openColumns: ColumnType[];
  rightMode: RightPanelMode;
  isLeftLayout: boolean;
  isRightLayout: boolean;
  isExpandedMode: boolean;

  setRightMode: (mode: RightPanelMode) => void;
  openExpandedLayout: () => void;
  closeRightLayout: () => void;
  openLeftLayout: () => void;
}
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);
const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
const LayoutProvider = ({ children, initialColumns }: LayoutProviderProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  const searchParams = useSearchParams();
  const [openColumns, setOpenColumns] = useState<ColumnType[]>(
    initialColumns ?? ["left", "center"],
  );
  const [rightMode, setRightMode] = useState<RightPanelMode>("notebook");
  const [isExpandedMode, setIsExpandedMode] = useState(false);
  const unique = useCallback((columns: ColumnType[]) => {
    return [...new Set(columns)];
  }, []);
  
  const normalize = useCallback(
    (columns: ColumnType[], mobile: boolean) => {
      if (mobile) {
        const [first] = columns.length ? columns : ["left"];
        return [first] as ColumnType[];
      }
      const deduped = unique(columns);
      if(isExpandedMode && deduped.length === 0) return ["center"] as ColumnType[];
      if(deduped.length === 0) return ["left", "center"] as ColumnType[];
      if(deduped.length === 1) return [deduped[0], "center"] as ColumnType[];
      return unique(deduped) as ColumnType[];
    },
    [unique, isExpandedMode],
  );
  useEffect(() => {
    const expanded = searchParams.get("expanded") === "true";
    if(expanded) {
      setIsExpandedMode(true);
    }
    else {
      setIsExpandedMode(false);
    }
  }, [searchParams]);

 
  const commitColumns = useCallback(
    (columns: ColumnType[]) => {
      setOpenColumns(normalize(columns, isMobile));
    },
    [isMobile, normalize],
  );

  const openLeftLayout = useCallback(() => {
    commitColumns(["left"]);
    setIsExpandedMode(false);
  }, [commitColumns]);
  
  const openRightLayout = useCallback(() => {
    commitColumns(["right"]);
  }, [commitColumns]);

  const openExpandedLayout = useCallback(() => {
    commitColumns(["center"]);
    setIsExpandedMode(true);
}, [commitColumns]);


  const closeRightLayout = useCallback(() => {
    setRightMode("notebook");
    // if not expanded mode and not mobile, open left layout
    if(!isExpandedMode && !isMobile){
      commitColumns(["left"]);
    }
    else{
      commitColumns(["center"]);
    }
  }, [isExpandedMode, commitColumns, isMobile]);
 
  const openColumn = useCallback(
    (columnType: ColumnType) => {
      if (columnType === "left") {
        commitColumns(["left"]);
        return;
      }
      if (columnType === "center") {
        commitColumns(["center"]);
        return;
      }
      commitColumns(["right"]);
    },
    [commitColumns],
  );

  const closeColumn = useCallback(
    (columnType: ColumnType) => {
      if (columnType === "right") {
        commitColumns(["left"]);
      }
      else if(columnType === "left"){
        commitColumns(["center"]); 
      }
    },
    [commitColumns],
  );

  const isColumnOpen = useCallback(
    (columnType: ColumnType) => openColumns.includes(columnType),
    [openColumns],
  );

  

  useEffect(() => {
    setOpenColumns((prev) => normalize(prev, isMobile));
  }, [isMobile, normalize]);

  const value = useMemo(
    (): LayoutContextType => ({
      isColumnOpen,
      openColumn,
      closeColumn,
      isRightLayout: isColumnOpen("right"),
      isLeftLayout: isColumnOpen("left"),
      isExpandedMode,
      openColumns,
      rightMode,
      setRightMode,
      closeRightLayout,
      openExpandedLayout,
      openRightLayout,
      openLeftLayout,
    }),
    [closeColumn, closeRightLayout, isColumnOpen, isExpandedMode, openColumn, openColumns, openExpandedLayout, openLeftLayout, openRightLayout, rightMode],
  );

  return (
    <LayoutContext.Provider value={{
        ...value,
    }}>{children}</LayoutContext.Provider>
  );
};

export { LayoutProvider, useLayout };