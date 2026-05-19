import { SettingsRoute } from "@/types"
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";


type UserSettingsContextType = {
    currentRoute: SettingsRoute;
    currentRouteIndex: number;
    stack: SettingsRoute[];
    push: (nextRoute: Exclude<SettingsRoute, "menu">) => void;
    pop: () => void;

}
const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);
export function UserSettingsProvider({children}: {children: React.ReactNode}){
    const [stack, setStack] = useState<SettingsRoute[]>(["menu"])
  const currentRoute = useMemo(() => stack[stack.length - 1], [stack]);
  const push = useCallback((nextRoute: Exclude<SettingsRoute, "menu">) => {
    setStack(prev => [...prev, nextRoute])
  }, []);

  const pop = useCallback(() => {
    if(stack.length <= 1){
      return;
    }
    setStack(prev => prev.filter(r => r !== prev[prev.length -1]))
  }, [stack.length]);

  const value = useMemo(() => ({
    currentRoute,
    currentRouteIndex: stack.indexOf(currentRoute),
    stack,
    push,
    pop,
  }),[pop, push, currentRoute, stack])

  return (
    <UserSettingsContext.Provider value={value}>
        {children}
    </UserSettingsContext.Provider>
  )
}


export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (!context) throw new Error("useUserSettings must be used within a UserSettingsProvider");
  return context;
}
