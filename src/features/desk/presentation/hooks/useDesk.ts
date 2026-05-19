"use client";
import { useQuery } from "@tanstack/react-query";
import { getDeskAction } from "@/actions/desk/queries/getDeskAction";
import { deskKeys } from "@/lib/queries";
import { getMyDeskAction, getDeskDetailAction, getMyDeskDetailAction } from "@/actions/desk";

export function useDesk(deskId: string | null) {
    return useQuery({
        queryKey: deskKeys.detail(deskId ?? ""),
        queryFn: async () => {
            if(!deskId){
                throw new Error("deskId is required to fetch desk.");
            }
            const result = await getDeskAction(deskId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!deskId,
       
    });
}

export function useDeskDetail(deskId: string | null) {
    return useQuery({
    queryKey: deskKeys.detail(deskId ?? "", "detail"),
    queryFn: async () => {
        if(!deskId){
            throw new Error("deskId is required to fetch desk.");
        }
        const result = await getDeskDetailAction(deskId);
        if(!result.success){
            throw result.error;
        }
        return result.data;
    },
    enabled: !!deskId,
  });
}

export function useMyDesk(userId: string) {
    return useQuery({
        queryKey: deskKeys.myDesk(userId, "base"),
        queryFn: async () => {
            const result = await getMyDeskAction(userId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!userId,
    });
}

export function useMyDeskDetail(userId: string) {
    return useQuery({
        queryKey: deskKeys.myDesk(userId, "detail"),
        queryFn: async () => {
            const result = await getMyDeskDetailAction( userId);
            if(!result.success){
                throw result.error;
        }
        return result.data;
    },
    enabled: !!userId,
});
}