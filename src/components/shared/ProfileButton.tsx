"use client"
import { ProfileForButton } from "@/features/profile/infrastructure/queries";
import { Button, ButtonProps } from "../ui";
import { useProfileContext, useUser } from "@/app/providers";
import { cn } from "@/lib/utils";
import { ProfileAvatarWithStatus } from "@/features/presence/presentation/components";

interface ProfileButtonProps extends ButtonProps {
  showsName?: boolean;
  nameClassName?: string;
  profile: ProfileForButton;
}

export function ProfileButton({
  showsName,
  nameClassName,
  profile,
  className,
  ...props
}: ProfileButtonProps) {
  const {user} = useUser();
  const { openProfile } = useProfileContext();
  if (!profile) return null;
  return (
      <div className="flex items-center gap-2">
    
      <Button
        {...props}
        onClick={() => openProfile(profile.userId)}
        variant="default"
        className="p-0"
      >
        {profile && <ProfileAvatarWithStatus size="lg" profile={profile} className={className} />}
    

     
      </Button>
      {showsName && (
        <p className={cn("row", nameClassName)}>
          {profile.userId === user.id
            ? "You"
            : profile?.displayName || profile.username}
         
        </p>
      )}
      </div>
    
  );
};

