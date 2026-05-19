"use server";
import {  makeDeleteNotebookUseCase } from "@/composition/notebook/makeDeleteNotebookUseCase";
import { ActionResult } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { toActionError } from "@/shared/action";
import { ApplicationError } from "@/shared/utils/errors";
import { DeleteNotebookResult } from "@/features/notebook/application/dto";

export async function deleteNotebookAction(id: string): Promise<ActionResult<DeleteNotebookResult>> {
    try {
        const useCase = makeDeleteNotebookUseCase();
        const result = await useCase.execute(id);
        if(!result.success){
            return fail(result.error);
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
    
}