"use client";
import { createProfileSchema } from "@/lib/validation";
import { CreateProfileFormValues } from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { useChangeUsername } from "./";
import { createProfileAction } from "@/actions/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationError } from "@/shared/utils/errors";
import { deskKeys, profileKeys } from "@/lib/queries";
import { useAuth } from "@/app/providers";
import { CreateProfileResult } from "../../application/dto";

type UseCreateProfileFormProps = {
    onSuccess?: (result: CreateProfileResult) => void;
    onError?: (error: string) => void;
    userId: string;
}
export function useCreateProfileForm({userId, onSuccess, onError}: UseCreateProfileFormProps) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const form = useForm<CreateProfileFormValues>({
        resolver: zodResolver(createProfileSchema),
        defaultValues: {
            displayName: "",
            username: user?.email?.split("@")[0] ?? "",
            avatarFile: null,
            schoolId: "",
        },
    });
    const createProfileMutation = useMutation({
        mutationKey: ["createProfile"],
        mutationFn: async(data: CreateProfileFormValues) => {

        
        const result = await createProfileAction({
            userId,
            username: data.username,
            displayName: data.displayName,
            avatarFile: data.avatarFile,
            schoolId: data.schoolId,
        });
        if(!result.success){
            throw result.error;
        }
        return result.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
            queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(userId, "detail") });
            onSuccess?.(data);
        },
        onError: (error) => {
            form.setError("root", { message: error.message });
            onError?.(error.message);
        },
    })
    const { checkUsername } = useChangeUsername({userId, form});
    const createProfile = useCallback(async(data: CreateProfileFormValues) => {
        const isUsernameAvailable = await checkUsername();
        if(!isUsernameAvailable) return;
        createProfileMutation.mutate(data);
        

    }, [checkUsername, createProfileMutation]);
    return {form, isLoading: createProfileMutation.isPending, error: createProfileMutation.error, createProfile};
}