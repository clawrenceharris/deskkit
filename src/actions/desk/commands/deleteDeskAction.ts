"use server";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { DeleteDeskResult } from "@/features/desk/application/dto";
import { makeDeleteDeskUseCase } from "@/composition/desk";

export async function deleteDeskAction(deskId: string): Promise<ActionResult<DeleteDeskResult>> {
    try {   
        const useCase = makeDeleteDeskUseCase();
        const result = await useCase.execute(deskId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    }
    catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}       