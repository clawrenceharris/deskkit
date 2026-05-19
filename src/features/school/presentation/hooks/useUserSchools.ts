import { schoolKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { getDetailedSchoolsByUserAction } from "@/actions/school";
import { SchoolForDetail } from "../../infrastructure/queries";

export function useUserSchools(userId: string, select?: (data: SchoolForDetail[]) => SchoolForDetail[]){
    return useQuery({
        queryKey: schoolKeys.listByUserId(userId),
        queryFn: async() => {
            
            const result = await getDetailedSchoolsByUserAction(userId);
            if(!result.success){
               throw result.error;
            }
            return result.data;
        },
        enabled: !!userId,
        select,
    });
}