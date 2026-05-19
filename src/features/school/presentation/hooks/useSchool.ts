"use client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { schoolKeys } from "@/lib/queries";
import { getSchoolDetailAction } from "@/actions/school";
import { SchoolForDetail } from "../../infrastructure/queries";
export function useSchool(schoolId: string | null): UseQueryResult<SchoolForDetail | null> {
    return useQuery({
        queryKey: schoolKeys.detail(schoolId ?? ""),
        queryFn: async () => {
            if(!schoolId){
                throw new Error("schoolId is required to fetch school.");
            } 
            const result = await getSchoolDetailAction(schoolId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!schoolId,
    });
}