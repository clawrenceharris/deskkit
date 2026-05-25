"use client";
import { MotionProps } from "motion/react";
import { getShortDate } from "@/shared/utils";
import { AvatarGroup, Card, CardFooter, CardHeader, AvatarGroupCount, ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui";
import { DeskForCard } from "@/features/desk/infrastructure/queries";
import { LogOut, Pencil, Settings, Trash2 } from "lucide-react";
import { useDeskPolicy } from "../../hooks";
import { useAuth } from "@/app/providers";
import { toast } from "sonner";
import { ProfileAvatarWithStatus } from "@/features/presence/presentation/components";

interface DeskListItemProps extends MotionProps {
  onClick?: (desk: DeskForCard) => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onManageClick?: () => void;
  onLeaveClick?: () => void;
  desk: DeskForCard;
  showMembers?: boolean;
  selected?: boolean;
}

export function DeskListItem ({
  selected,
  desk,
  onClick,
  onEditClick,
  onDeleteClick,
  onManageClick,
  onLeaveClick,
  showMembers = true
}: DeskListItemProps) {
  const { user } = useAuth();
  const { data: policy } = useDeskPolicy({ deskId: desk.id, userId: user?.id ?? null  });
  const lastItem = desk.notebooks[desk.notebooks.length - 1];

  function handleEditClick() {
    if(policy && policy.canUpdate) {
      onEditClick?.();
    }
    else {
      toast.error("You do not have permission to update this desk");
    }
  }
  function handleDeleteClick() {
    if(policy && policy.canDelete) {
      onDeleteClick?.();
    }
    else {
      toast.error("You do not have permission to delete this desk");
    }
  }
  function handleManageClick() {
      onManageClick?.();
  }
  
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card
          tabIndex={0}
          onKeyDown={(e) => {
            if(e.key === "Enter" || e.key === " ") {
              onClick?.(desk);
            }
          }}
          aria-label={`Open desk ${desk.name}`}
          onClick={() => onClick?.(desk)}
          className={`
            relative
            flex flex-col 
            bg-primary-foreground 
            w-full max-w-[400px] 
            outline-0
            mx-auto p-0 
            min-h-[150px]
            transition-all duration-90
            whitespace-nowrap 
            box-shadow 
            cursor-pointer 
            rounded-xl 
            focus:outline-2 focus:outline-secondary/50
            outline-offset-2
            ${selected ? "outline-2 outline-secondary" : ""}`}
        >
          <CardHeader
            style={{
              backgroundSize: "cover",
              backgroundImage: "url(https://i.ibb.co/N6q6BGpt/desk.png)",
            }}
            className="flex h-30 relative"
          >
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 w-full h-full" />
            

              <div className="absolute text-white  px-4 py-2 bottom-0 left-0 flex items-center justify-between w-full">

              
              <p>{desk.name}</p>
              {showMembers && (
                <AvatarGroup  className="flex items-center">
                {desk.members.slice(0, 3).map((member) => (
                  <ProfileAvatarWithStatus className="border-none" tabIndex={-1} profile={member.profile} key={member.profile.userId}/>
                ))}
                {desk.members.length > 3 && <AvatarGroupCount className="text-foreground size-[20px] bg-secondary-foreground">+{desk.members.length - 3}</AvatarGroupCount>}
              </AvatarGroup>
            )}
            
            </div>
          </CardHeader>
          <CardFooter className="flex justify-between pb-4 w-full line-clamp-1 rounded-b-xl bg-primary-foreground">
          
            {
              lastItem ? (
                  <p className="text-muted-foreground">{`${lastItem.creator.displayName || lastItem.creator.username} posted`}
                  {" "}
                  <span className="inline-block max-w-[150px] align-bottom truncate font-bold">
                    {lastItem.title}
                  </span>
                  {" "}
                  {`${getShortDate(new Date(lastItem.createdAt))}`}
                  </p>
              )
                :
                ( <p className="text-muted-foreground">No activity yet</p>
                
                )
            }
            
          </CardFooter>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleEditClick}>
          <Pencil/> Edit
        </ContextMenuItem>
        <ContextMenuItem onClick={handleManageClick}>
          <Settings/> Manage
        </ContextMenuItem>
        {desk.creatorId === user?.id &&<ContextMenuItem variant="destructive" onClick={handleDeleteClick}>
          <Trash2/> Delete
        </ContextMenuItem>}
        {desk.creatorId !== user?.id && <ContextMenuItem variant="destructive" onClick={onLeaveClick}>
          <LogOut/> Leave Desk
        </ContextMenuItem>}
      </ContextMenuContent>
       
    </ContextMenu>
  );
};

