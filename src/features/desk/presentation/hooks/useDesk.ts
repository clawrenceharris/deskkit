"use client";
import { useQuery } from "@tanstack/react-query";
import { getDeskAction, getDeskCardAction } from "@/actions/desk/queries/getDeskAction";
import { deskKeys, schoolKeys } from "@/lib/queries";
import { getMyDeskAction, getDeskDetailAction, getMyDeskDetailAction, getSchoolDeskAction, getSchoolDeskDetailAction, getSchoolDeskCardAction } from "@/actions/desk";

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

export function useDeskCard(deskId: string | null) {
    return useQuery({
        queryKey: deskKeys.detail(deskId ?? "", "card"),
        queryFn: async () => {
            if(!deskId){
                throw new Error("deskId is required to fetch desk card.");
            }
            const result = await getDeskCardAction(deskId);
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
        queryKey: deskKeys.myDesk(userId),
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

export function useSchoolDesk(schoolId: string | null) {
    return useQuery({
        queryKey: deskKeys.schoolDesk(schoolId ?? ""),
        queryFn: async () => {
            if(!schoolId){
                throw new Error("schoolId is required to fetch school desk.");
            }
            const result = await getSchoolDeskAction(schoolId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!schoolId,
    });
}

export function useSchoolDeskDetail(schoolId: string | null) {
    return useQuery({
        queryKey: deskKeys.schoolDesk(schoolId ?? "", "detail"),
        queryFn: async () => {
            if(!schoolId){
                throw new Error("schoolId is required to fetch school desk detail.");
            }
            const result = await getSchoolDeskDetailAction(schoolId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!schoolId,
    });
}

export function useSchoolDeskCard(schoolId: string | null) {
    return useQuery({
        queryKey: deskKeys.schoolDesk(schoolId ?? "", "card"),
        queryFn: async () => {
            if(!schoolId){
                throw new Error("schoolId is required to fetch school desk card.");
            }
            const result = await getSchoolDeskCardAction(schoolId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!schoolId,
    });
}