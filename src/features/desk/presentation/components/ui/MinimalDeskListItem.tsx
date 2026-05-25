import { APP_ROUTES } from "@/app/providers";
import { Icon } from "@/components/shared";
import { Avatar, AvatarFallback, AvatarImage, HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui";
import { DeskForCard } from "@/features/desk/infrastructure/queries";
import Link from "next/link";
import { DeskListItem } from "./DeskListItem";
import deskIcon from "@/assets/desk-icon.png";
import { ExternalLink } from "lucide-react";

type MinimalDeskListItemProps = {
  desk: DeskForCard;

}
export function MinimalDeskListItem({desk}: MinimalDeskListItemProps) {
  return (

    <HoverCard>
        <HoverCardContent className="w-90 p-0 rounded-xl" side="right">
            <DeskListItem desk={desk} showMembers={false}/>
        </HoverCardContent>
        <HoverCardTrigger asChild>
          
            <Link 
            href={APP_ROUTES.desk(desk.id)}        
            className="flex w-full gap-2 hover:bg-muted/70 items-center justify-between rounded-lg bg-surface text-foreground shadow-md border border-muted p-4"
            >
            <div className="flex items-center gap-2">

             
            <Avatar>
                <AvatarImage src={desk.imageUrl ?? undefined}/>
                <AvatarFallback>
                <Icon src={deskIcon} alt={desk.name} />
                </AvatarFallback>
            </Avatar>
            
            <h4 className="text-sm font-bold">{desk.name}</h4>
            </div>
            <ExternalLink className="size-4 text-muted-foreground"/>
            </Link>
        </HoverCardTrigger>
    </HoverCard>
  );
}