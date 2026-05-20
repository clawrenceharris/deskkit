"use client";
import { useCallback } from "react";
import { createSchoolDeskAction } from "@/actions/desk";
import { toast } from "sonner";
import { ApplicationError } from "@/shared/utils/errors";
import { deskKeys } from "@/lib/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateSchoolDesk() {
    const queryClient = useQueryClient();
    
    const createSchoolDeskMutation = useMutation({
        mutationKey: ["createSchoolDesk"],
        mutationFn: async (schoolId: string) => {
            const result = await createSchoolDeskAction(schoolId);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        onSuccess: (_, schoolId) => {
            queryClient.invalidateQueries({ queryKey: deskKeys.listBySchoolId(schoolId) });
            toast.success(`School Desk created successfully`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    
    const createSchoolDesk = useCallback(async(schoolId: string) => {
         createSchoolDeskMutation.mutate(schoolId);
    }, [createSchoolDeskMutation]);
   
    return { createSchoolDesk, error: createSchoolDeskMutation.error, isLoading: createSchoolDeskMutation.isPending};

}