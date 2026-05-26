import { ACTIVITY_STATUS_INDICATORS, ActivityStatusValue } from "@/features/presence/domain/types";
import { cn } from "@/lib/utils";
import { AvatarBadge } from "../ui/avatar";

type StatusIndicatorProps = {
    status: ActivityStatusValue;
    statusClassName?: string;
    isBadge?: boolean;
}
export function ActivityStatusIndicator({ status, statusClassName, isBadge = true }: StatusIndicatorProps) {
   
  const { Icon, backgroundColor, iconClassName } = ACTIVITY_STATUS_INDICATORS[status];
  
  if(isBadge){

    return (
      <AvatarBadge className={cn(backgroundColor, statusClassName)}>
        {Icon && <Icon  className={cn("size-3", iconClassName)}/>}
      </AvatarBadge>
    )
  }
  return (
    <span className={cn(backgroundColor, "relative size-4 rounded-full flex items-center justify-center", statusClassName)}>{Icon && <Icon  className={cn("size-3", iconClassName)}/>}</span>
  )
}