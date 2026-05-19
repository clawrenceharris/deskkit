"use client";
import { useCallback } from "react";
import { createMyDeskAction } from "@/actions/desk";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationError, getUserErrorMessage } from "@/shared/utils/errors";
import { deskKeys } from "@/lib/queries";

export function useCreateMyDesk() {
    const queryClient = useQueryClient();
   
    const createMyDeskMutation = useMutation({
        mutationKey: ["createMyDesk"],
        mutationFn: async ({userId}: {userId: string}) => {
            const result = await createMyDeskAction(userId);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(variables.userId) });
        },
        onError: (error) => {
            toast.error(getUserErrorMessage(error));
        },
    });
    const createMyDesk = useCallback(async(userId: string) => {
        return await createMyDeskMutation.mutateAsync({userId});

    }, [createMyDeskMutation]);
    return { createMyDesk, error: createMyDeskMutation.error, isLoading: createMyDeskMutation.isPending};

}