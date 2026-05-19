"use client";
import { useQuery } from "@tanstack/react-query";
import { Desk, DeskForCard, DeskForDetail } from "../../infrastructure/queries";
import { deskKeys } from "@/lib/queries";
import { getDeskCardsBySchoolAction, getDesksBySchoolAction, getDetailedDesksBySchoolAction } from "@/actions/desk";
export function useSchoolDesks (schoolId: string | null, select?: (data: Desk[]) => Desk[]) {
    return useQuery({
        queryKey: deskKeys.listBySchoolId(schoolId ?? ""),
        queryFn: async() => {
            if(!schoolId){
                throw new Error("schoolId is required to fetch school desks.");
            }
            const result = await getDesksBySchoolAction(schoolId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!schoolId,
        select,
    });
}

export function useDetailedSchoolDesks(schoolId: string | null, select?: (data: DeskForDetail[]) => DeskForDetail[]) {
    return useQuery({
        queryKey: deskKeys.listBySchoolId(schoolId ?? ""),
        queryFn: async() => {
            if(!schoolId){
                throw new Error("schoolId is required to fetch school detailed desks.");
            }
            const result = await getDetailedDesksBySchoolAction(schoolId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        select,
    });
}

export function useSchoolDeskCards(schoolId: string | null, select?: (data: DeskForCard[]) => DeskForCard[]) {
    return useQuery({
        queryKey: deskKeys.listBySchoolId(schoolId ?? ""),
        queryFn: async() => {
            if(!schoolId){
                throw new Error("schoolId is required to fetch school desk cards.");
            }
            const result = await getDeskCardsBySchoolAction(schoolId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!schoolId,
        select,
    });
}