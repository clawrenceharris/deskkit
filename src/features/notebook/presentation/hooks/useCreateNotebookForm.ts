"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateNotebookFormValues } from "@/types";
import { createNotebookSchema } from "@/lib/validation";
import { useCallback } from "react";
import { createNotebookAction } from "@/actions/notebook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationError, getUserErrorMessage } from "@/shared/utils/errors";
import { notebookKeys } from "@/lib/queries";
import { CreateNotebookResult } from "@/features/notebook/application/dto";

type UseCreateNotebookFormProps = {
    deskId: string;
    userId: string | null;
    onSuccess?: (result: CreateNotebookResult) => void;
    onError?: (error: string) => void;
}
export function useCreateNotebookForm({deskId, userId, onSuccess, onError}: UseCreateNotebookFormProps) {
    const queryClient = useQueryClient();
    const form = useForm<CreateNotebookFormValues>({
        resolver: zodResolver(createNotebookSchema),
        defaultValues: {
            title: "",
            description: "",
            materials: [],
            
        },
    });

    const createNotebookMutation = useMutation({
        mutationFn: async(data: CreateNotebookFormValues) => {
            if(!userId) {
                throw new Error("User ID is required");
            }
            const result = await createNotebookAction({
                deskId,
                userId,
                    title: data.title,
                    description: data.description,
                    materials: data.materials.map(material => ({
                        type: material.type ?? "OTHER",
                        file: material.file,
                    }))
                
            });
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        onMutate: async (data: CreateNotebookFormValues) => {
            await queryClient.cancelQueries({ queryKey: deskKeys.detail(deskId, "detail") });
            await queryClient.cancelQueries({ queryKey: deskKeys.listByUserId(userId ?? "", "detail") });

            const previousDesk = queryClient.getQueryData<any>(deskKeys.detail(deskId, "detail"));
            const previousUserDesks = queryClient.getQueryData<any>(deskKeys.listByUserId(userId ?? "", "detail"));

            const tempId = `temp:${Date.now()}`;
            const optimisticNotebook = {
                id: tempId,
                title: data.title,
                deskId,
                creator: { userId: userId },
                votes: [],
                downloads: [],
                materials: [],
            };

            if (previousDesk) {
                queryClient.setQueryData(deskKeys.detail(deskId, "detail"), {
                    ...previousDesk,
                    notebooks: [optimisticNotebook, ...(previousDesk.notebooks ?? [])],
                });
            }

            if (previousUserDesks) {
                queryClient.setQueryData(deskKeys.listByUserId(userId ?? "", "detail"), (old: any) =>
                    (old ?? []).map((desk: any) =>
                        desk.id === deskId ? { ...desk, notebooks: [optimisticNotebook, ...(desk.notebooks ?? [])] } : desk,
                    ),
                );
            }

            return { previousDesk, previousUserDesks, tempId };
        },
        onSuccess: (data, _variables, context: any) => {
            onSuccess?.(data);
            queryClient.invalidateQueries({ queryKey: notebookKeys.listByDeskId(deskId) });

            const created: any = {
                id: data.notebookId,
                title: data.title,
                deskId: data.deskId,
                creator: { userId: data.creatorId },
                votes: [],
                downloads: [],
                materials: [],
            };

            // Replace temporary notebook id with real one in desk detail
            queryClient.setQueryData(deskKeys.detail(deskId, "detail"), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    notebooks: (old.notebooks ?? []).map((nb: any) => (nb.id?.toString().startsWith("temp:") ? created : nb)),
                };
            });

            if (userId) {
                queryClient.setQueryData(deskKeys.listByUserId(userId, "detail"), (old: any) =>
                    (old ?? []).map((desk: any) =>
                        desk.id === deskId
                            ? { ...desk, notebooks: (desk.notebooks ?? []).map((nb: any) => (nb.id?.toString().startsWith("temp:") ? created : nb)) }
                            : desk,
                    ),
                );
            }
        },
        onError: (error, _variables, context: any) => {
            form.setError("root", { message: getUserErrorMessage(error) });
            onError?.(getUserErrorMessage(error));
            // rollback
            if (context?.previousDesk) {
                queryClient.setQueryData(deskKeys.detail(deskId, "detail"), context.previousDesk);
            }
            if (context?.previousUserDesks) {
                queryClient.setQueryData(deskKeys.listByUserId(userId ?? "", "detail"), context.previousUserDesks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(deskId, "detail") });
            if (userId) {
                queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(userId, "detail") });
            }
        },
    });
    const createNotebook = useCallback(async(data: CreateNotebookFormValues) => {
        return await createNotebookMutation.mutateAsync(data);
    }, [createNotebookMutation]);
    return {form, createNotebook, error: createNotebookMutation.error, isLoading: createNotebookMutation.isPending };
}