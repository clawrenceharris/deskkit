import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeskAction } from "@/actions/desk";
import { toast } from "sonner";
import { useCallback } from "react";
import { deskKeys } from "@/lib/queries/keys";
import { CreateDeskInput, CreateDeskResult } from "../../application/dto";
import { CreateDeskFormValues } from "@/types";
import { DeskVisibility } from "../../domain/value-objects";

type UseCreateDeskProps = {
    onSuccess?: (result: CreateDeskResult) => void;
    onError?: (error: string) => void;
    userId: string;
}

export function useCreateDesk({userId, onSuccess, onError}: UseCreateDeskProps) {
    const queryClient = useQueryClient();
   const createDeskMutation = useMutation({
        mutationKey: ["createDesk"],
        mutationFn: async (data: CreateDeskInput) => {
            const result = await createDeskAction(data);
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
            toast.error(error.message);
            onError?.(error.message);
        },
    });

    const createDesk = useCallback(async (data: CreateDeskFormValues) => {
        return await createDeskMutation.mutateAsync({
            ...data,
            creatorId: userId,
            visibility: data.visibility ?? DeskVisibility.SCHOOL,
            
        });
    }, [createDeskMutation, userId]);

    return {createDesk, isLoading: createDeskMutation.isPending, error: createDeskMutation.error};

}