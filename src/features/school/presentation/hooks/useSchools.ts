import { useQuery } from "@tanstack/react-query";
import { getDetailedSchoolsAction } from "@/actions/school";
import { SchoolForDetail } from "../../infrastructure/queries";
import { schoolKeys } from "@/lib/queries";

export function useSchools(select?: (data: SchoolForDetail[]) => SchoolForDetail[]) {
  return useQuery({
    queryKey: schoolKeys.all,
    queryFn: async () => {
      const result = await getDetailedSchoolsAction();
      if(!result.success){
        throw result.error;
      }
      return result.data;
    },
    select,
  });
}
