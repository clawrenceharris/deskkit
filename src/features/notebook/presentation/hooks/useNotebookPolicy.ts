import { GetNotebookPolicyInput } from "../../application/dto";
import { useQuery } from "@tanstack/react-query";
import { getNotebookPolicyAction } from "@/actions/notebook/queries/getNotebookPolicyAction";
import { notebookKeys } from "@/lib/queries";

export function useNotebookPolicy(input: GetNotebookPolicyInput) {
    return useQuery({
        queryKey: notebookKeys.policy(input.notebookId ?? ""),
        queryFn: async () => {
            const result = await getNotebookPolicyAction(input);
            if(!result.success){
                throw result.error;
            }
            return result.data;
        },
        enabled: !!input.notebookId && !!input.userId && !!input.deskId,
    });
}