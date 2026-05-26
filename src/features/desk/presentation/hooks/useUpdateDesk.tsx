import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  updateDeskAction } from "@/actions/desk";
import { useCallback } from "react";
import { deskKeys } from "@/lib/queries/keys";
import { UpdateDeskFormValues } from "@/types";
import { UpdateDeskResult } from "../../application/dto";
import { ActionError } from "@/shared/action";

type UseUpdateDeskProps = {
    onSuccess?: (result: UpdateDeskResult) => void;
    onError?: (error: string) => void;
    deskId: string;
}

export function useUpdateDesk({ deskId, onSuccess, onError}: UseUpdateDeskProps) {
    const queryClient = useQueryClient();
    const updateDeskMutation = useMutation<UpdateDeskResult, ActionError, {id: string, data: UpdateDeskFormValues}>({
        mutationKey: ["updateDesk"],
        mutationFn: async ({id, data} : {id: string, data: UpdateDeskFormValues}) => {
            const result = await updateDeskAction({
                ...data,
                deskId: id
            });
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        onSuccess: (data) => {
            onSuccess?.(data);
            queryClient.invalidateQueries({ queryKey: deskKeys.lists() });
        },
        onError: (error) => {
            onError?.(error.message);
        },
    });

    const updateDesk = useCallback(async (data: UpdateDeskFormValues) => {
        return await updateDeskMutation.mutateAsync({
            id: deskId,
            data
        });
    }, [deskId, updateDeskMutation]);

    return {updateDesk, isLoading: updateDeskMutation.isPending, error: updateDeskMutation.error};

}