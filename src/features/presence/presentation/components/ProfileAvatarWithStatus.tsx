"use client";

import { ProfileAvatar } from "@/features/profile/presentation/components/ui/ProfileAvatar";
import { ProfileForButton } from "@/features/profile/infrastructure/queries";
import { useActivityStatus } from "../hooks";

type ProfileAvatarWithStatusProps = {
  profile: ProfileForButton | null;
  previewUrl?: string | null;
  showStatus?: boolean;
} & React.ComponentProps<typeof ProfileAvatar>;

/**
 * ProfileAvatar that automatically resolves and displays real-time activity status.
 */
export function ProfileAvatarWithStatus({
  profile,
  previewUrl,
  showStatus = true,
  ...props
}: ProfileAvatarWithStatusProps) {
  const activity = useActivityStatus(profile?.userId);
  return (
    <ProfileAvatar
      profile={profile}
      previewUrl={previewUrl}
      status={showStatus ? activity.status : undefined}
      {...props}
    />
  );
}
