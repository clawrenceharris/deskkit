import { DeskSection } from "@/app/providers/HomeNavigationProvider";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Lock, LockIcon } from "lucide-react";
import { motion, type TargetAndTransition } from "motion/react";
import type { ReactNode } from "react";

type DeskSpaceSupply = {
  id: string;
  className?: string;
  children: ReactNode;
  rest: TargetAndTransition;
  hover: TargetAndTransition;
};

type DeskSpaceCardProps = {
  section: DeskSection;
  onClick?: (section: DeskSection) => void;
  supplies?: DeskSpaceSupply[];
  label: string;
  selected?: boolean;
  locked?: boolean;
}


export function DeskSpaceCard({selected, section, label, onClick, supplies = [], locked = false }: DeskSpaceCardProps) {
  
  return (
    <motion.button
      initial="rest"
      animate={selected ? "hover" : "rest"}
      whileHover="hover"
      whileFocus="focus"
      onClick={() => onClick?.(section)}
      disabled={locked}
      className={cn(
        `flex-1 
        cursor-pointer
        flex
        items-start
        justify-start
        h-full
        bg-card/60
        w-full
        relative
        p-0
        text-right
        flex-col
        transition-all duration-300 ease-in-out
        shadow-sm
        border-muted
        border
        overflow-hidden
        rounded-lg
        hover:bg-white
        focus:bg-white
        `,
        locked && "pointer-events-none",
        // Selected state: apply the same outline and text styles as focus & hover states for each section
        {
          "focus:outline-secondary": section === DeskSection.notebooks,
          "focus:outline-primary": section === DeskSection.chalkboards,
          "focus:outline-orange-500": section === DeskSection.burningQuestions,
          "focus:outline-tertiary": section === DeskSection.studyRooms,
          "text-secondary": section === DeskSection.notebooks,
          "text-primary": section === DeskSection.chalkboards,
          "text-orange-500": section === DeskSection.burningQuestions,
          "text-tertiary": section === DeskSection.studyRooms,
          // Selected state styles (per section)
          "outline-2 outline-secondary bg-white border-0":
            selected && section === DeskSection.notebooks,
          "outline-2 outline-primary bg-white border-0":
            selected && section === DeskSection.chalkboards,
          "outline-2 outline-orange-500 bg-white border-0":
            selected && section === DeskSection.burningQuestions,
          "outline-2 outline-tertiary bg-white border-0":
            selected && section === DeskSection.studyRooms,
        }
      )}
    >
     {locked && (
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 backdrop-blur-xs z-30 flex items-center justify-center">
        <Lock strokeWidth={3} className="size-6 text-white" />
      </div>
     )}
      <div className="relative z-20 px-3 py-5 rounded-t-lg w-full ">
        <h3 className="font-bold text-lg">
          {label}
        </h3>
      </div>
      <div
        className={cn(
          "w-full h-full p-0 absolute bottom-0 pointer-events-none flex",
        )}
        style={{
          background: (() => {
            if (section === DeskSection.notebooks)
              return "radial-gradient(circle at 0% 160%, var(--color-secondary) 0%, transparent 70%)";
            if (section === DeskSection.chalkboards)
              return "radial-gradient(circle at 0% 160%, var(--color-primary) 0%, transparent 70%)";
            if (section === DeskSection.burningQuestions)
              return "radial-gradient(circle at 0% 160%, var(--color-accent) 0%, transparent 70%)";
            if (section === DeskSection.studyRooms)
              return "radial-gradient(circle at 0% 160%, var(--color-tertiary) 0%, transparent 70%)";
            return undefined;
          })(),
        }}
      >
        {supplies.map((supply, index) => (
          <motion.div
            key={supply.id}
            className={cn(
              "absolute origin-top z-10",
              supply.className,
              "bottom-0 right-0"
            )}
            variants={{
              rest: supply.rest,
              hover: supply.hover,
              focus: supply.hover,
            }}
            animate={selected ? "hover" : undefined}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
              delay: index * 0.045,
            }}
          >
            {supply.children}
          </motion.div>
        ))}
      </div>
    </motion.button>
  );
}