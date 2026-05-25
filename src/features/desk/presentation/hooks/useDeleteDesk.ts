"use client";
import { deleteDeskAction } from "@/actions/desk";
import { deskKeys } from "@/lib/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

export const useDeleteDesk = () => {
    const queryClient = useQueryClient();
    const deleteDeskMutation = useMutation({
        mutationKey: ["deleteDesk"],
        mutationFn: async (deskId: string) => {
            const result = await deleteDeskAction(deskId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: deskKeys.lists() });
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(data.deskId, "detail") });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const deleteDesk = useCallback(async (deskId: string) => {
        return await deleteDeskMutation.mutateAsync(deskId);
    }, [deleteDeskMutation]);
    return { deleteDesk, isLoading: deleteDeskMutation.isPending };
}   