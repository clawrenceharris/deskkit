"use client";
import { GetDeskPolicyInput } from "../../application/dto";
import { useQuery } from "@tanstack/react-query";
import { getDeskPolicyAction } from "@/actions/desk/queries/getDeskPolicyAction";
import { deskKeys } from "@/lib/queries";

export function useDeskPolicy(input: GetDeskPolicyInput) {
   return useQuery({
    queryKey: deskKeys.policy(input.deskId ?? ""),
    queryFn: async () =>{
      const result = await getDeskPolicyAction(input);
      if(!result.success){
        throw result.error;
      }
      return result.data;
    },
    enabled: !!input.deskId && !!input.userId,

   });
   
}