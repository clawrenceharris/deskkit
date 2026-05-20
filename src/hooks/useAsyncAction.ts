import { ActionResult, toActionError } from "@/shared/action";
import { fail } from "@/shared/application";
import { ApplicationError, getUserErrorMessage } from "@/shared/utils/errors";
import { useCallback, useState } from "react";

export function useAsyncAction<TData>() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    
    const execute = useCallback(async (fn: () => Promise<ActionResult<TData>>): Promise<ActionResult<TData>> => {
    
        try {
            setIsLoading(true);
            const result = await fn();
            if(!result.success){
                throw result.error;
            }
            return result;
        } catch (error) {
            const errorMessage = getUserErrorMessage(error)
            setError(errorMessage);
            return fail(ApplicationError.unexpected(error));
        } finally {
            setIsLoading(false);
        }
      },[]);
    
    return {isLoading, error, execute};
}
