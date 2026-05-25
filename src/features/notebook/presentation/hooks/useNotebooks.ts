"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NotebookForCard, NotebookForDetail } from "../../infrastructure/queries";
import { notebookKeys } from "@/lib/queries";
import { getDetailedNotebooksAction, getDetailedNotebooksByDeskAction, getDetailedNotebooksByCreatorAction, getNotebookCardsByDeskAction, getNotebookCardsAction } from "@/actions/notebook";
import { useSchoolContext } from "@/app/providers";

export function useNotebooks(select?: (data: NotebookForDetail[]) => NotebookForDetail[]) {
    const {currentSchoolId} = useSchoolContext();
    return useQuery({
        queryKey: notebookKeys.listBySchoolId(currentSchoolId ?? ""),
        queryFn: async () => {
            const result = await getDetailedNotebooksAction();
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        select,
    });
}
export function useDetailedNotebooks(select?: (data: NotebookForDetail[]) => NotebookForDetail[]) {
    const {currentSchoolId} = useSchoolContext();
    return useQuery({
        queryKey: notebookKeys.listBySchoolId(currentSchoolId ?? "", "detail"),
        queryFn: async () => {
            const result = await getDetailedNotebooksAction();
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        select,
    });
}

export function useNotebookCards(select?: (data: NotebookForCard[]) => NotebookForCard[]) {
    const {currentSchoolId} = useSchoolContext();
    return useQuery({
        queryKey: notebookKeys.listBySchoolId(currentSchoolId ?? "", "card"),
        queryFn: async () => {
            const result = await getNotebookCardsAction();
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        select,
    });
}

export function useUserNotebooks(userId: string | null, select?: (data: NotebookForDetail[]) => NotebookForDetail[]) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: notebookKeys.listByUserId(userId ?? ""),
        initialData: queryClient.getQueryData(notebookKeys.listByUserId(userId ?? "")) as NotebookForDetail[] | undefined,
        queryFn: async () => {
            if (!userId) {
                throw new Error("userId is required to fetch notebooks by userId.");
            }
            const result = await getDetailedNotebooksByCreatorAction(userId);
            if (!result.success) {
                throw result.error;
            }
            queryClient.setQueryData(notebookKeys.listByUserId(userId), result.data);
            return result.data;
    
        },
        select,
        enabled: !!userId,
    });
}
export function useDeskNotebooks(deskId: string | null, select?: (data: NotebookForDetail[]) => NotebookForDetail[]) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: notebookKeys.listByDeskId(deskId ?? ""),
        initialData: queryClient.getQueryData(notebookKeys.listByDeskId(deskId ?? "")) as NotebookForDetail[] | undefined,
        queryFn: async () => {
            if(!deskId){
                throw new Error("deskId is required to fetch notebooks by deskId.");
            }
            const result = await getDetailedNotebooksByDeskAction(deskId);
            if(!result.success){
                throw result.error;
            }
            queryClient.setQueryData(notebookKeys.listByDeskId(deskId), result.data);
            return result.data;
        },
        enabled: !!deskId,
        select,
    });
}

export function useDeskNotebookCards(deskId: string | null, select?: (data: NotebookForCard[]) => NotebookForCard[]) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: notebookKeys.listByDeskId(deskId ?? "", "card"),
        queryFn: async () => {
            if(!deskId){
                throw new Error("deskId is required to fetch notebook cards by deskId.");
            }
            const result = await getNotebookCardsByDeskAction(deskId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!deskId,
        select,
    });
}