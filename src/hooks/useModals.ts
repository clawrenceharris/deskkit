import { useDeskContext, useModal } from "@/app/providers";
import { DESK_MODAL_TYPES } from "@/features/desk/presentation/components/modals";
import { NOTEBOOK_MODAL_TYPES } from "@/features/notebook/presentation/components/modals";
import { CreateNotebookModalProps, CreateDeskModalProps, CreateProfileModalProps, UpdateDeskModalProps, UpdateProfileModalProps, DeleteDeskModalProps, ConfirmationModalProps, UpdateNotebookModalProps } from "@/lib/modals/types";
import { PROFILE_MODAL_TYPES } from "@/features/profile/presentation/components/modals";
import { useQueryClient } from "@tanstack/react-query";
import { notebookKeys, deskKeys, profileKeys } from "@/lib/queries/keys";
import { toast } from "sonner";
import { CreateNotebookResult, UpdateNotebookResult } from "@/features/notebook/application/dto";
import { CreateDeskResult, DeleteDeskResult, UpdateDeskResult } from "@/features/desk/application/dto";
import { CreateProfileResult, UpdateProfileResult } from "@/features/profile/application/dto";


export function useModals() {
    const { openModal, closeModal } = useModal();
    const queryClient = useQueryClient();
    const {setCurrentDeskId, setCurrentNotebookId} = useDeskContext();
    
    function handleCreateDesk (result: CreateDeskResult) {
        queryClient.invalidateQueries({ queryKey: deskKeys.detail(result.deskId, "detail") });
        queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(result.creatorId, "detail") });
        setCurrentDeskId(result.deskId);
        closeModal();
    }
    function handleUpdateDesk (result: UpdateDeskResult) {
        queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(result.creatorId, "detail") });
        queryClient.invalidateQueries({ queryKey: deskKeys.detail(result.deskId, "detail") });
        toast.success("Desk updated successfully");
        closeModal();
    }
    function handleDeleteDesk (result: DeleteDeskResult) {
        queryClient.invalidateQueries({ queryKey: deskKeys.lists() });
        queryClient.invalidateQueries({ queryKey: deskKeys.detail(result.deskId) });
        toast.success("Desk deleted successfully");
        closeModal();
    }
    function handleCreateNotebook (result: CreateNotebookResult) {
        queryClient.invalidateQueries({ queryKey: notebookKeys.listByDeskId(result.deskId) });
        queryClient.invalidateQueries({ queryKey: notebookKeys.listByUserId(result.creatorId) });
        // Keep desk & user joined-desks detail up to date for global search
        queryClient.invalidateQueries({ queryKey: deskKeys.detail(result.deskId, "detail") });
        queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(result.creatorId, "detail") });

        setCurrentNotebookId(result.notebookId);
        setCurrentDeskId(result.deskId);
        closeModal();
    }
    function handleUpdateNotebook (result: UpdateNotebookResult) {
        queryClient.invalidateQueries({ queryKey: notebookKeys.listByDeskId(result.deskId) });
        queryClient.invalidateQueries({ queryKey: notebookKeys.detail(result.notebookId) });
        closeModal();
    }
    function handleCreateProfile (result: CreateProfileResult) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(result.userId) });
        closeModal();
    }
    function handleUpdateProfile (result: UpdateProfileResult) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(result.userId) });
        closeModal();
    }
    const modals = {
        ["confirmation"]: {
            open: ({title, description, onConfirm}: {title: string, description: string, onConfirm: () => void}) => {
                openModal<ConfirmationModalProps>("confirmation", {
                    title,
                    isAlert: true,
                    description,
                    onConfirm,
                    onCancel: closeModal
                });
            }
        },
        [DESK_MODAL_TYPES.CREATE]: {
            open: (userId: string) => {
                openModal<CreateDeskModalProps>(DESK_MODAL_TYPES.CREATE, {
                    userId,
                    onSuccess: handleCreateDesk,
                    onCancel: closeModal
                });
            }
        },
        [DESK_MODAL_TYPES.UPDATE]: {
            open: (deskId: string, userId: string) => {
                openModal<UpdateDeskModalProps>(DESK_MODAL_TYPES.UPDATE, {
                    deskId,
                    userId,
                    onSuccess: handleUpdateDesk,
                    onCancel: closeModal
                });
            }
        },
        [NOTEBOOK_MODAL_TYPES.CREATE]: {
            open: (deskId: string) => {
                openModal<CreateNotebookModalProps>(NOTEBOOK_MODAL_TYPES.CREATE, {
                    deskId: deskId,
                    onSuccess: handleCreateNotebook,
                    onCancel: closeModal
                });
            }
        },
        [NOTEBOOK_MODAL_TYPES.UPDATE]: {
            open: (notebookId: string, deskId: string) => {
                openModal<UpdateNotebookModalProps>(NOTEBOOK_MODAL_TYPES.UPDATE, {
                    notebookId,
                    deskId,
                    onSuccess: handleUpdateNotebook,
                    onCancel: closeModal
                });
            }
        },
        [PROFILE_MODAL_TYPES.CREATE]: {
            open: (userId: string) => {
                openModal<CreateProfileModalProps>(PROFILE_MODAL_TYPES.CREATE, {
                    userId,
                    onSuccess: handleCreateProfile,
                    onCancel: closeModal,
                });
            }
        },
        [PROFILE_MODAL_TYPES.UPDATE]: {
            open: (userId: string) => {
                openModal<UpdateProfileModalProps>(PROFILE_MODAL_TYPES.UPDATE, {
                    userId,
                    onSuccess: handleUpdateProfile,
                    onCancel: closeModal,
                });
            }
        },
        [DESK_MODAL_TYPES.DELETE]: {
            open: (deskName: string) => {
                openModal<DeleteDeskModalProps>(DESK_MODAL_TYPES.DELETE, {
                    deskName,
                    isAlert: true,
                    onSuccess: handleDeleteDesk,
                    onCancel: closeModal,
                });
            }
        },
    }
    return {modals};
}