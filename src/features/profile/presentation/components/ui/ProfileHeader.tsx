
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { ProfileAvatarField } from "../forms";
import { useUpdateProfileForm } from "../../hooks";
import { Button } from "@/components/ui";
import { Loader2, Pencil } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileTab, UpdateProfileFormValues } from "@/types/profile";
import { useProfileContext } from "@/app/providers";
import { useActivityStatus } from "@/features/presence/presentation/hooks";

type ProfileHeaderProps = {
    profile: ProfileForDetail;
    onEditUsernameClick: () => void;
}
export function ProfileHeader({profile, onEditUsernameClick}: ProfileHeaderProps){
    const {form, isLoading, updateProfile} = useUpdateProfileForm({profile});
    const {control, formState: { isDirty, isValid }, resetField} = form;
    
    const { user } = useAuth();
    const { isCurrentUser } = useProfileContext();
    const activityStatus = useActivityStatus(profile.userId);
   
    function handleSubmit(data: UpdateProfileFormValues){
        updateProfile(data);
        resetField("avatarFile");
    }
    return (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          
        <div className="flex flex-col justify-start items-start gap-4">
         <div className="flex items-end gap-2">
          {profile.userId === user?.id ? (
              <ProfileAvatarField
                profile={profile}
                status={activityStatus.status}
                size="2xl"
                isLoading={isLoading}
                control={control}
                name="avatarFile"
                showLabel={false}
                showDescription={false}
              />
            ) : (
              <ProfileAvatar status={activityStatus.status} size="2xl" previewUrl={profile.avatarUrl} profile={profile} />
            )}
             {isDirty && isValid && (  
              <Button type="submit" size="xs" variant="tertiary" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
          )}
        
         </div>
         
          <div className="flex flex-col items-start gap-0.5">
          {profile.displayName && (
            <h2 className="text-base font-bold">{profile.displayName}</h2>
          )}
           <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
              {profile.username}
            </span>
            </div>
        </div>
      </form>
    
    )
}
    
    