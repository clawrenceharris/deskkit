"use client";
import { useQuery } from "@tanstack/react-query";
import { notebookKeys } from "@/lib/queries";
import { ApplicationError } from "@/shared/utils/errors";
import { getNotebookDetailAction } from "@/actions/notebook";
import { AppErrorCode } from "@/types/errors";

const DESK_ITEM_QUERY_TIMEOUT_MS = 20_000;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new ApplicationError({code: AppErrorCode.NOTEBOOK_TIMEOUT, message: timeoutMessage}));
        }, timeoutMs);
        promise
            .then((value) => {
                clearTimeout(timeoutId);
                resolve(value);
            })
            .catch((error) => {
                clearTimeout(timeoutId);
                reject(error);
            });
    });
}

export function useNotebook(notebookId: string | null) {
    return useQuery({
        queryKey: notebookKeys.detail(notebookId ?? ""),
        queryFn: async () => {
            if(!notebookId){
                throw new Error("notebookId is required to fetch a notebook.");
            }
            const result = await withTimeout(
                getNotebookDetailAction(notebookId),
                DESK_ITEM_QUERY_TIMEOUT_MS,
                "Loading this notebook is taking longer than expected. Please try again."
            );
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!notebookId,
        retry: 1,
    });
}

export function useNotebookDetail(notebookId: string | null) {
    return useQuery({
        queryKey: notebookKeys.detail(notebookId ?? ""),
        queryFn: async () => {
            if(!notebookId){
                throw new Error("notebookId is required to fetch a notebook.");
            }
            const result = await withTimeout(
                getNotebookDetailAction(notebookId),
                DESK_ITEM_QUERY_TIMEOUT_MS,
                "Loading this notebook is taking longer than expected. Please try again."
            );
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
    });
}