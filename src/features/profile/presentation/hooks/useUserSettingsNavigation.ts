"use client";

import { SettingsRoute } from "@/types";
import { useCallback, useMemo, useState } from "react";


export function useUserSettingsNavigation() {
  const [stack, setStack] = useState<SettingsRoute[]>(["menu"])
  const route = useMemo(() => stack[stack.length - 1], [stack]);
  const push = useCallback((nextRoute: Exclude<SettingsRoute, "menu">) => {
    setStack(prev => [...prev, nextRoute])
  }, []);

  const pop = useCallback(() => {
    if(stack.length <= 1){
      return;
    }
    setStack(prev => prev.filter(route => route !== prev[prev.length -1]))
  }, [stack.length]);

  return {
    route,
    push,
    pop,
  };
}
