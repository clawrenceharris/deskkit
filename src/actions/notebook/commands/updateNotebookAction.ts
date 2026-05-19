"use server";
import { makeUpdateNotebookUseCase } from "@/composition/notebook";
import { UpdateNotebookInput, UpdateNotebookResult } from "@/features/notebook/application/dto";
import { ActionResult } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { toActionError } from "@/shared/action";
import { ApplicationError } from "@/shared/utils/errors";

export async function updateNotebookAction(input: UpdateNotebookInput): Promise<ActionResult<UpdateNotebookResult>> {
    try {
        const useCase = await makeUpdateNotebookUseCase();
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