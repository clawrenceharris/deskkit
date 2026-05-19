"use server";
import { CreateNotebookInput, CreateNotebookResult } from "@/features/notebook/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { makeCreateNotebookUseCase } from "@/composition/notebook";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok } from "@/shared/application";


export async function createNotebookAction(input: CreateNotebookInput): Promise<ActionResult<CreateNotebookResult>> {
    try {
        const useCase = await makeCreateNotebookUseCase();
        const result = await useCase.execute(input);
        if(!result.success){
            return fail(result.error);
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
    
}