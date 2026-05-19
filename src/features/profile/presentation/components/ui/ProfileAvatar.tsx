import { Avatar } from "@/components/ui/avatar";
import { Profile } from "../../../infrastructure/queries";
import { AvatarBadge, AvatarImage, AvatarFallback } from "@/components/ui";
import { Image, UserIcon } from "lucide-react";
type ProfileAvatarProps = {
    profile: Profile | null;
    previewUrl?: string | null;
}
export function ProfileAvatar({profile, previewUrl}: ProfileAvatarProps) {
  console.log(previewUrl);
  return (
    <Avatar
      size="2xl"
      className="rounded-full bg-input/20 object-cover"
      style={{
        boxShadow: "0 0 0 1.5px var(--color-muted, #e4e4e7)",
      }}
    >
      <AvatarBadge className="bg-success right-2 size-4.5"/>
      <img
        src={previewUrl ?? profile?.avatarUrl ?? undefined}
        alt="Profile"
        className="object-cover"
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