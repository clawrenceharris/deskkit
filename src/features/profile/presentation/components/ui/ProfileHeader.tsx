
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { ProfileAvatarField } from "../forms";
import { useUpdateProfileForm } from "../../hooks";
import { Button } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { UpdateProfileFormValues } from "@/types/profile";
import { useActivityStatus } from "@/features/presence/presentation/hooks";
import { ProfileAvatarWithStatus } from "@/features/presence/presentation/components";
import { FormProvider } from "react-hook-form";

type ProfileHeaderProps = {
    profile: ProfileForDetail;
}
export function ProfileHeader({profile}: ProfileHeaderProps){
    const {form, isLoading, updateProfile} = useUpdateProfileForm({profile});
    const {control, formState: { isDirty, isValid }, resetField} = form;
    
    const { user } = useAuth();
    const activityStatus = useActivityStatus(profile.userId);
   
    function handleSubmit(data: UpdateProfileFormValues){
        updateProfile(data);
        resetField("avatarFile");
    }
    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col justify-start items-start gap-4">
          <div className="flex items-end gap-2">
            {profile.userId === user?.id ? (
                <ProfileAvatarField<UpdateProfileFormValues, "avatarFile">
                  profile={profile}
                  control={control}
                  status={activityStatus.status}
                  size="2xl"
                  isLoading={isLoading}
                  name="avatarFile"
                  showLabel={false}
                  showDescription={false}
                />
              ) : (
                <ProfileAvatarWithStatus size="2xl" previewUrl={profile.avatarUrl} profile={profile} />
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
      </FormProvider>
    
    )
}
    
    