
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { ProfileAvatarField } from "../../hooks/useProfileImageField";
import { useUpdateProfileForm } from "../../hooks";
import { Button } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { ProfileAvatar } from "./ProfileAvatar";
import { UpdateProfileFormValues } from "@/types/profile";

type ProfileHeaderProps = {
    profile: ProfileForDetail;
}
export function ProfileHeader({profile}: ProfileHeaderProps){
    const {form, isLoading, updateProfile} = useUpdateProfileForm({profile});
    const {control, formState: { isDirty, isValid }, resetField} = form;
    
    const { user } = useAuth();
    
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
                isLoading={isLoading}
                control={control}
                name="avatarFile"
                showLabel={false}
                showDescription={false}
              />
            ) : (
              <ProfileAvatar previewUrl={profile.avatarUrl} profile={profile} />
            )}
             {isDirty && isValid && (  
              <Button type="submit" size="xs" variant="tertiary" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
          )}
        
         </div>
         
          
          {profile.displayName && (
            <h2 className="text-base font-bold">{profile.displayName}</h2>
          )}
        </div>
      </form>
    
    )
}
    
    