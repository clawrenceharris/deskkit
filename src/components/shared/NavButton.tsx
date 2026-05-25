import { cn } from "@/lib/utils";
import { Button } from "../ui";
import React from "react";
import Image, { StaticImageData } from "next/image";

type NavButtonProps = {
    selected: boolean;
    icon?: StaticImageData;
    label?: string;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
  }

export function NavButton({
  selected, 
  icon, 
  label, 
  onClick, 
  className, 
  disabled = false 
}: NavButtonProps) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Button 
            aria-label={label} 
            aria-selected={selected}
            className={cn(
                "group bg-card text-foreground size-12 shadow-md hover:bg-card/10 border-2 border-muted transition-colors duration-200", // Limit Button transition to colors only
                selected && !disabled && "bg-linear-to-t from-primary to-primary/50 text-white border-primary shadow-md shadow-primary/30",
                className
            )}  
            size="icon-lg" 
            onClick={onClick} 
            variant="tertiary"
            disabled={disabled}
        >
            {icon && <span
                className={cn(
                    "size-full flex items-center justify-center transition-transform duration-200 ease-in-out",
                    selected && !disabled
                        ? "scale-120 -translate-y-[8px]"
                        : "group-hover:scale-108"
                )}
            >
               <Image src={icon} alt={label ?? ""} width={24} height={24} className="size-full" /> 
            </span>}
        </Button>

       {label && <p className="text-sm text-muted-foreground">{label}</p>}
      </div>
    );
  }