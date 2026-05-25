"use client";
import { useCallback } from "react";
import { createMyDeskAction } from "@/actions/desk";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationError } from "@/shared/utils/errors";
import { deskKeys } from "@/lib/queries";

export function useCreateMyDesk() {
    const queryClient = useQueryClient();
   
    const createMyDeskMutation = useMutation({
        mutationKey: ["createMyDesk"],
        mutationFn: async (userId: string) => {
            const result = await createMyDeskAction(userId);
            if(!result.success){
                throw result.error;
            }   
            return result.data;
        },
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: deskKeys.myDesk(userId) });
            toast.success(`My Desk created successfully`);
        },
        onError: (error, userId) => {
            queryClient.invalidateQueries({ queryKey: deskKeys.myDesk(userId) });

            toast.error(error.message);
        },
    });
    const createMyDesk = useCallback(async(userId: string) => {
        createMyDeskMutation.mutate(userId);

    }, [createMyDeskMutation]);
    return { createMyDesk, error: createMyDeskMutation.error, isLoading: createMyDeskMutation.isPending};

}