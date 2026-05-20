import { Avatar } from "@/components/ui/avatar";
import { Profile } from "../../../infrastructure/queries";
import { AvatarBadge, AvatarImage, AvatarFallback } from "@/components/ui";
import { Ban, CircleCheck, CircleDot, CircleX, Dot, Moon, UserIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
    profile: Profile | null;
    previewUrl?: string | null;
    status?: "online" | "offline" | "away" | "dnd";
    statusClassName?: string;
} & React.ComponentProps<typeof Avatar>;
export function ProfileAvatar({profile, previewUrl, status, statusClassName, ...props}: ProfileAvatarProps) {
  const statusBadge = {
    online: "bg-success",
    offline: "bg-gray-400",
    away: "bg-orange-400",
    dnd: "bg-tertiary",
  }
  function getStatusIcon() {
    switch (status) {
      case "online":
        return <Dot strokeWidth={17} className="text-white" />;
      case "offline":
        return <Ban strokeWidth={4} className="text-white" />;

      case "away":
        return <Dot strokeWidth={17} className="text-white" />;
      case "dnd":
        return <Moon  fill="currentColor" className="text-white" />;

    }
  }
  return (
    <Avatar
      className="rounded-full bg-input/20 object-cover"
      style={{
        boxShadow: "0 0 0 1.5px var(--color-muted, #e4e4e7)",
      }}
      {...props}
    >
      {status &&  (
        <AvatarBadge className={cn(statusBadge[status], statusClassName)}>
          {getStatusIcon()}
        </AvatarBadge>
      )}
      <AvatarImage
        src={previewUrl ?? profile?.avatarUrl ?? undefined}
        alt="Profile image"
        className="object-cover"
        key={previewUrl}
      />
      <AvatarFallback className="rounded-full group-hover:hidden text-xl">
        {profile ? (
          profile.displayName
            ? (() => {
                const names = profile.displayName.trim().split(/\s+/);
                if (names.length === 1) {
                  return names[0][0]?.toUpperCase() ?? "";
                } else {
                  const first = names[0][0]?.toUpperCase() ?? "";
                  const last = names[names.length - 1][0]?.toUpperCase() ?? "";
                  return first + last;
                }
              })()
            : profile.username?.charAt(0).toUpperCase() ?? ""
        ) : (
          <UserIcon className="size-8 text-muted-foreground" />
        )}
      </AvatarFallback>
    </Avatar>
  )
}