"use client";

import type { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { motion, useReducedMotion } from "motion/react";
import { ChangeOrAddSchool, ProfileSettingsEditPanel, ProfileSettingsList, ProfileSettingsPanel, SchoolSettingsPanel } from "./";
import React from "react";
import type { SettingsAction, SettingsItem, SettingsRoute } from "@/types/settings";
import { Button } from "@/components/ui";
import { ChevronLeft } from "lucide-react";
import { useUserSettings } from "../../providers";


type SettingsPanelProps = {
  children: React.ReactNode;
  title: string;
  onBack?: () => void; 
  isSelected?: boolean;
  isMenu?: boolean;
  x: string;
  zIndex: number;
}

/**
 * A single full-size panel in the settings drawer.
 *
 * Panels stay mounted so Framer Motion can animate them between stack positions
 * instead of unmounting/remounting content on every navigation. The parent
 * computes each panel's horizontal offset (`x`) from the current navigation
 * stack: previous routes sit to the left, the active route sits at `0%`, and
 * routes that are not currently in the stack wait offscreen to the right.
 */
function SettingsPanel({isSelected, x, zIndex, isMenu, onBack, title, children} : SettingsPanelProps ){
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : IOS_SWIPE_TRANSITION;

  return (
    <motion.div
        initial={false}
        className="absolute w-full inset-0 flex flex-col overflow-hidden"
        style={{ zIndex }}
        animate={{ x: isSelected ? "0%" : x}}
        transition={transition}
      >
         
         <div className="flex flex-col gap-3 overflow-y-auto px-5 min-h-0 h-full flex-1">
         
         <div className="flex shrink-0 items-center gap-2  pt-1">
          {!isMenu && <Button
             type="button"
             variant="ghost"
             size="icon-sm"
             onClick={onBack}
             aria-label="Back to settings"
           >
             <ChevronLeft strokeWidth={3} />
           </Button>}
           <h3 className="font-bold text-lg">{title}</h3>
         </div>
        
         {children}
       </div>
         
    </motion.div>
  )
}

type ProfileSettingsStackProps = {
  profile: ProfileForDetail;
  onNavigate: (route: Exclude<SettingsRoute, "menu">) => void;
  onAction: (action: SettingsAction) => void;
  onBack: () => void;

};

const IOS_SWIPE_TRANSITION = {
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1] as const,
};

export function ProfileSettingsStack({
  profile,
  onNavigate,
  onBack,
  onAction,
}: ProfileSettingsStackProps) {
  const { currentRoute, stack, pop } = useUserSettings();
  const currentRouteIndex = stack.length - 1;

  /**
   * Resolve where a panel should live relative to the active stack route.
   *
   * This intentionally uses the real navigation stack instead of a hard-coded
   * route depth map. With the old level-based approach, sibling panels such as
   * "my-schools" and "my-profile" could both resolve to the active level and
   * sit at `0%`, which made the incoming panel appear on top of the menu/sibling
   * instead of cleanly replacing it.
   */
  const getPanelPlacement = (route: SettingsRoute) => {
    const stackIndex = stack.lastIndexOf(route);

    if (stackIndex === -1) {
      return {
        x: "100%",
        zIndex: 0,
      };
    }

    return {
      x: stackIndex < currentRouteIndex ? "-100%" : "0%",
      zIndex: stackIndex + 1,
    };
  };

  function handleSelect(setting: SettingsItem) {
    const {routeTo, action} = setting;
    if(routeTo){
      onNavigate(routeTo);
    }
    if(action){
      onAction(action);
    }
  }

  /**
   * Panel definitions are kept declarative: route metadata lives here while
   * stack movement is handled above. Each route should appear once in this
   * list and should use `onSelect` to either push another route or trigger an
   * action.
   */
  const panels = [
    {
      route: "menu",
      title: "Settings",
      isMenu: true,
      content: <ProfileSettingsList onSelect={handleSelect} />,
    },
    {
      route: "my-schools",
      title: "My Schools",
      onBack: pop,
      content: <SchoolSettingsPanel onSelect={handleSelect} />,
    },
    {
      route: "my-profile",
      title: "My Profile",
      onBack: pop,
      content: <ProfileSettingsPanel onSelect={handleSelect} />,
    },
    {
      route: "manage-school",
      title: "Manage School",
      onBack,
      content: (
        <ChangeOrAddSchool
          profile={profile}
          onSuccess={onBack}
        />
      ),
    },
    {
      route: "edit-profile",
      title: "Edit Profile",
      onBack,
      content: (
        <ProfileSettingsEditPanel
          profile={profile}
          onSuccess={onBack}
        />
      ),
    },
  ];

  return (
    <div className="relative min-h-0 h-full flex-1 px-5">
      {panels.map((panel) => (
        (() => {
          const placement = getPanelPlacement(panel.route as SettingsRoute);

          return (
            <SettingsPanel
              key={panel.route}
              title={panel.title}
              isMenu={panel.isMenu}
              isSelected={currentRoute === panel.route}
              onBack={panel.onBack}
              x={placement.x}
              zIndex={placement.zIndex}
            >
              {panel.content}
            </SettingsPanel>
          );
        })()
      ))}
    </div>
  );
}
