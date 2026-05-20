import { deskKeys } from "@/lib/queries/keys";
import type {} from "@/features/desk/infrastructure/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  JoinOrLeaveDeskInput } from "../../application/dto";
import { toast } from "sonner";
import { joinOrLeaveDeskAction } from "@/actions/desk";
import { useCallback, useState } from "react";

export function useJoinOrLeaveDesk() {
    const [isJoining, setIsJoining] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const queryClient = useQueryClient();
    const joinOrLeaveDeskMutation = useMutation({
        mutationKey: ["joinOrLeaveDesk"],
        mutationFn: async (input:  JoinOrLeaveDeskInput) => {
            const result = await joinOrLeaveDeskAction(input);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        onMutate: async (variables: JoinOrLeaveDeskInput) => {
            const { deskId, userId, isJoining } = variables as { deskId: string; userId: string; isJoining?: boolean };
            await queryClient.cancelQueries({ queryKey: deskKeys.listByUserId(userId, "card") });
            await queryClient.cancelQueries({ queryKey: deskKeys.listByUserId(userId, "detail") });
            const previousCard = queryClient.getQueryData<unknown>(deskKeys.listByUserId(userId, "card"));
            const previousDetail = queryClient.getQueryData<unknown>(deskKeys.listByUserId(userId, "detail"));

            // Try to reuse existing desk detail if present
            const existingDeskDetail = queryClient.getQueryData<unknown>(deskKeys.detail(deskId, "detail"));
            const optimisticDesk: unknown = existingDeskDetail ?? {
                id: deskId,
                name: "Desk",
                notebooks: [],
                members: [],
                creator: { userId },
            };

            if (isJoining) {
                if (previousCard) {
                    queryClient.setQueryData(deskKeys.listByUserId(userId, "card"), [optimisticDesk, ...(previousCard as unknown[])]);
                }
                if (previousDetail) {
                    queryClient.setQueryData(deskKeys.listByUserId(userId, "detail"), [optimisticDesk, ...(previousDetail as unknown[])]);
                }
            } else {
                // leaving
                if (previousCard) {
                    queryClient.setQueryData(deskKeys.listByUserId(userId, "card"), (previousCard as unknown[]).filter((d) => (d as { id?: string }).id !== deskId));
                }
                if (previousDetail) {
                    queryClient.setQueryData(deskKeys.listByUserId(userId, "detail"), (previousDetail as unknown[]).filter((d) => (d as { id?: string }).id !== deskId));
                }
            }

            return { previousCard, previousDetail };
        },
        onSuccess: (_, variables) => {
            // Refresh members and policy for the affected desk
            queryClient.invalidateQueries({ queryKey: deskKeys.members(variables.deskId), });
            queryClient.invalidateQueries({ queryKey: deskKeys.policy(variables.deskId) });
            // Keep both card and detail shapes in sync so UI lists and global search (which uses "detail") update promptly
            queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(variables.userId, "card") });
            queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(variables.userId, "detail") });
            toast.success(`${variables.isJoining ? "Joined" : "Left"} Desk`);
        },
        onError: (error, variables, context: unknown) => {
            toast.error(error.message);
            const userId = (variables as JoinOrLeaveDeskInput | undefined)?.userId;
            const ctx = context as { previousCard?: unknown; previousDetail?: unknown } | undefined;
            if (ctx?.previousCard && userId) {
                queryClient.setQueryData(deskKeys.listByUserId(userId, "card"), ctx.previousCard);
            }
            if (ctx?.previousDetail && userId) {
                queryClient.setQueryData(deskKeys.listByUserId(userId, "detail"), ctx.previousDetail);
            }
        },
        onSettled: (_data, _error, variables) => {
            // ensure server state is reflected
            queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(variables.userId, "card") });
            queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(variables.userId, "detail") });
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.deskId, "detail") });
        },
    });
    const joinDesk = useCallback(async (input: { role: "CONTRIBUTOR" | "OWNER" | "VIEWER"}  & JoinOrLeaveDeskInput) => {
        setIsJoining(true);
        try {
            await joinOrLeaveDeskMutation.mutateAsync({...input, isJoining: true});
        } finally {
            setIsJoining(false);
        }
    }, [joinOrLeaveDeskMutation]);

    const leaveDesk = useCallback(async (input: JoinOrLeaveDeskInput) => {
        setIsLeaving(true);
        try {
            await joinOrLeaveDeskMutation.mutateAsync(input);
        } finally {
            setIsLeaving(false);
        }
    }, [joinOrLeaveDeskMutation]);
    return { joinDesk, leaveDesk, isJoining, isLeaving };
}

