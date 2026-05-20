/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteNotebookAction } from "@/actions/notebook";
import { useUser } from "@/app/providers";
import { notebookKeys, deskKeys } from "@/lib/queries/keys";
import { ApplicationError } from "@/shared/utils/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

export const useDeleteNotebook = () => {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const deleteMutation = useMutation({
        mutationKey: ["deleteNotebook"],
        mutationFn: async({notebookId}: {deskId: string; notebookId: string}) => {
            const result = await deleteNotebookAction(notebookId);
            if(!result.success){
                throw new ApplicationError(result.error);
            }  
            return result.data;   
        },
        onMutate: async (variables: {notebookId: string; deskId: string}) => {
            const { notebookId, deskId } = variables;
            await queryClient.cancelQueries({ queryKey: deskKeys.detail(deskId, "detail") });
            await queryClient.cancelQueries({ queryKey: deskKeys.listByUserId(user.id, "detail") });

            const previousDesk = queryClient.getQueryData<any>(deskKeys.detail(deskId, "detail"));
            const previousUserDesks = queryClient.getQueryData<any>(deskKeys.listByUserId(user.id, "detail"));

            if (previousDesk) {
                queryClient.setQueryData(deskKeys.detail(deskId, "detail"), {
                    ...previousDesk,
                    notebooks: (previousDesk.notebooks ?? []).filter((nb: any) => nb.id !== notebookId),
                });
            }

            if (previousUserDesks) {
                queryClient.setQueryData(deskKeys.listByUserId(user.id, "detail"), (old: any) =>
                    (old ?? []).map((desk: any) =>
                        desk.id === deskId ? { ...desk, notebooks: (desk.notebooks ?? []).filter((nb: any) => nb.id !== notebookId) } : desk,
                    ),
                );
            }

            return { previousDesk, previousUserDesks };
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.deskId) });
            queryClient.invalidateQueries({ queryKey: notebookKeys.votes(variables.notebookId) });
            // Ensure the user's joined/desks detail list (used by global search) is refreshed
            queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(user.id, "detail") });
        },
        onError: (error, _variables, context: any) => {
            toast.error(error.message);
            if (context?.previousDesk) {
                queryClient.setQueryData(deskKeys.detail(context.previousDesk.id, "detail"), context.previousDesk);
            }
            if (context?.previousUserDesks) {
                queryClient.setQueryData(deskKeys.listByUserId(user.id, "detail"), context.previousUserDesks);
            }
        },
        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.deskId, "detail") });
            queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(user.id, "detail") });
        },
    });
    const deleteNotebook = useCallback(async(input: {notebookId: string, deskId: string}) => {
        const {notebookId, deskId} = input;
        deleteMutation.mutate({notebookId, deskId});
    }, [deleteMutation]);
    return { deleteNotebook, isLoading: deleteMutation.isPending };
}