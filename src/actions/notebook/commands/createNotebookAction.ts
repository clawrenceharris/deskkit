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
            console.error("Error creating notebook", result.error);
            return fail(result.error);
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        console.error("Error creating notebook", appError);
        return fail(toActionError(appError));
    }
    
}