"use server";
import { ActionResult } from "@/shared/action";
import { GetNotebookPolicyInput, GetNotebookPolicyResult } from "@/features/notebook/application/dto";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok } from "@/shared/application";
import { toActionError } from "@/shared/action";
import { makeGetNotebookPolicyUseCase } from "@/composition/notebook";

export async function getNotebookPolicyAction(input: GetNotebookPolicyInput): Promise<ActionResult<GetNotebookPolicyResult>> {
    try{
        const useCase = makeGetNotebookPolicyUseCase();
        const result = await useCase.execute(input);    
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    }
    catch(error){
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}   