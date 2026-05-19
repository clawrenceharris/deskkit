"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileAction, getProfileDetailAction } from "@/actions/profile";
import { profileKeys } from "@/lib/queries/keys";
import { ProfileForDetail } from "../../infrastructure/queries";
    
export function useProfile(userId: string | null) {
   return  useQuery({
        queryKey: profileKeys.detail(userId ?? "", "base"),
        
        queryFn: async () =>{
            if(!userId){
                throw new Error("userId is required to fetch profile.");
            }
            const result = await getProfileAction(userId);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!userId,
    });
}

export function useProfileDetail(userId: string | null) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: profileKeys.detail(userId ?? "", "detail"),
        initialData: queryClient.getQueryData<ProfileForDetail>(profileKeys.detail(userId ?? "", "detail")),
        queryFn: async () => {
            if(!userId){
                throw new Error("userId is required to fetch profile.");
            }
            const result = await getProfileDetailAction(userId);
            if(!result.success){
                throw result.error;
            }
            if(result.data){
                queryClient.setQueryData<ProfileForDetail>(profileKeys.detail(userId ?? "", "detail"), result.data);
            }
            return result.data;
        },
        enabled: !!userId,
    });
}