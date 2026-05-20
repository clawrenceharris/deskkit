import { updateProfileSchema } from "@/lib/validation";
import { UpdateProfileFormValues } from "@/types/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Profile } from "../../infrastructure/queries";
import { updateProfileAction } from "@/actions/profile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicationError } from "@/shared/utils/errors";
import { useChangeUsername } from "./useChangeUsername";
import { useCallback } from "react";
import { deskKeys, notebookKeys, profileKeys, schoolKeys } from "@/lib/queries";
import { UpdateProfileResult } from "../../application/dto";

type UseUpdateProfileFormProps = {
    onSuccess?: (result: UpdateProfileResult) => void;
    onError?: (error: string) => void;
    profile: Profile;
}
export const useUpdateProfileForm = ({onSuccess, onError, profile}: UseUpdateProfileFormProps) => {
    const queryClient = useQueryClient();
    const form = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            displayName: profile.displayName ?? "",
            username: profile.username,
            avatarFile: null,
            schoolId: profile.schoolId ?? "",
        },
    });
    useChangeUsername({userId: profile.userId, profile, form});

    const updateProfileMutation = useMutation({
        mutationFn: async(data: UpdateProfileFormValues) => {
            const result = await updateProfileAction({
                ...data,
                userId: profile.userId,
            });
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;

        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.all });
            queryClient.invalidateQueries({ queryKey: schoolKeys.all });
            queryClient.invalidateQueries({ queryKey: deskKeys.all });
            queryClient.invalidateQueries({ queryKey: notebookKeys.all });
            onSuccess?.(data);
        },
        onError: (error) => {
            onError?.(error.message);
        },
    });
    const updateProfile = useCallback(async(data: UpdateProfileFormValues) => {        
        return await updateProfileMutation.mutateAsync(data);
    }, [ updateProfileMutation]);
  return {
    form,
    isLoading: updateProfileMutation.isPending,
    updateProfile,
  };
};