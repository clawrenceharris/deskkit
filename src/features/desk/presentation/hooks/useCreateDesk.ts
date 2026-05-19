import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeskAction } from "@/actions/desk";
import { ApplicationError, getUserErrorMessage } from "@/shared/utils/errors";
import { toast } from "sonner";
import { useCallback } from "react";
import { deskKeys } from "@/lib/queries/keys";
import { CreateDeskInput, CreateDeskResult } from "../../application/dto";
import { CreateDeskFormValues } from "@/types";

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
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        onSuccess: (data) => {
            onSuccess?.(data);
            queryClient.invalidateQueries({ queryKey: deskKeys.lists() });
        },
        onError: (error) => {
            toast.error(getUserErrorMessage(error));
            onError?.(error.message);
        },
    });

    const createDesk = useCallback(async (data: CreateDeskFormValues) => {
        return await createDeskMutation.mutateAsync({
            ...data,
            creatorId: userId,
            isPublic: data.isPublic ?? true,
            
        });
    }, [createDeskMutation, userId]);

    return {createDesk, isLoading: createDeskMutation.isPending, error: createDeskMutation.error};

}