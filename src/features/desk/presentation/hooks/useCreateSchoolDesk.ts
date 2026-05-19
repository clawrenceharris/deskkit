"use client";
import { useCallback } from "react";
import { createSchoolDeskAction } from "@/actions/desk";
import { toast } from "sonner";
import { ApplicationError, getUserErrorMessage } from "@/shared/utils/errors";
import { deskKeys } from "@/lib/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateSchoolDesk() {
    const queryClient = useQueryClient();
    
    const createSchoolDeskMutation = useMutation({
        mutationKey: ["createSchoolDesk"],
        mutationFn: async ({schoolId}: {schoolId: string}) => {
            const result = await createSchoolDeskAction(schoolId);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: deskKeys.listBySchoolId(variables.schoolId) });
        },
        onError: (error) => {
            toast.error(getUserErrorMessage(error));
        },
    });
    
    const createSchoolDesk = useCallback(async(schoolId: string) => {
        return await createSchoolDeskMutation.mutateAsync({schoolId});
    }, [createSchoolDeskMutation]);
   
    return { createSchoolDesk, error: createSchoolDeskMutation.error, isLoading: createSchoolDeskMutation.isPending};

}