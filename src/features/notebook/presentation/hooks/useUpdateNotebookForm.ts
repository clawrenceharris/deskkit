import { UpdateNotebookFormValues } from "@/types";
import { useNotebook } from "./useNotebook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateNotebookSchema } from "@/lib/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNotebookAction } from "@/actions/notebook";
import { ApplicationError, getUserErrorMessage } from "@/shared/utils/errors";
import { useCallback, useState, useEffect } from "react";
import { notebookKeys } from "@/lib/queries";
import { withTimeout } from "@/shared/utils/withTimeout";
import { UpdateNotebookResult } from "@/features/notebook/application/dto";
const UPDATE_DESK_ITEM_TIMEOUT_MS = 60_000;

type UseUpdateNotebookFormProps = {
    notebookId: string;
    onSuccess?: (result: UpdateNotebookResult) => void;
    onError?: (error: string) => void;
}
export function useUpdateNotebookForm({notebookId, onSuccess, onError}: UseUpdateNotebookFormProps) {
    const queryClient = useQueryClient();
    const { data: notebook } = useNotebook(notebookId);
    const form = useForm<UpdateNotebookFormValues>({
        resolver: zodResolver(updateNotebookSchema),
        defaultValues: {
            title: "",
            description: "",
            materials: [],
        },
    });
    const [removedMaterialIds, setRemovedMaterialIds] = useState<string[]>([]);

    useEffect(() => {
        if (!notebook) {
            return;
        }
        form.reset({
            title: notebook.title ?? "",
            description: notebook.description ?? "",
            materials: [],
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRemovedMaterialIds([]);
    }, [notebook, form]);

    const toggleRemovedMaterialId = useCallback((materialId: string) => {
        setRemovedMaterialIds((previous) =>
            previous.includes(materialId)
                ? previous.filter((id) => id !== materialId)
                : [...previous, materialId]
        );
    }, []);

    const existingMaterials = notebook?.materials ?? [];

    const updateNotebookMutation = useMutation({
        mutationKey: ["updateNotebook"],
        retry: false,
        mutationFn: async(data: UpdateNotebookFormValues) => {
            const keepMaterialIds = existingMaterials
                .filter((material) => !removedMaterialIds.includes(material.id))
                .map((material) => material.id);
            const result = await withTimeout(
                updateNotebookAction({
                    notebookId,
                        title: data.title,
                        description: data.description,
                        materials: (data.materials ?? []).map((material) => ({
                            type: material.type ?? "OTHER",
                            file: material.file,
                        })),
                        removeMaterialIds: removedMaterialIds,
                        keepMaterialIds,
                    
                }),
                UPDATE_DESK_ITEM_TIMEOUT_MS,
                "Updating this notebook timed out. Please try again."
            );
            if (!result.success) {
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        onSuccess: (result) => {
            onSuccess?.(result);
            queryClient.invalidateQueries({ queryKey: notebookKeys.detail(result.notebookId) });
            queryClient.invalidateQueries({ queryKey: notebookKeys.listByDeskId(result.deskId) });
            queryClient.invalidateQueries({ queryKey: notebookKeys.listByUserId(result.creatorId) });
        },
        onError: (error) => {
            const message = getUserErrorMessage(error);
            form.setError("root", { message });
            onError?.(message);
        },
    });

    const updateNotebook = useCallback(async (data: UpdateNotebookFormValues) => {
        return await updateNotebookMutation.mutateAsync(data);
    }, [updateNotebookMutation]);

    return {
        form,
        updateNotebook,
        isLoading: updateNotebookMutation.isPending,
        existingMaterials,
        removedMaterialIds,
        toggleRemovedMaterialId,
    };
}