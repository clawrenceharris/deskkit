"use server";
import { UpdateDeskInput, UpdateDeskResult } from "@/features/desk/application/dto";
import { makeUpdateDeskUseCase } from "@/composition/desk";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { updateDeskSchema } from "@/lib/validation/desk";
import { AppErrorCode } from "@/types/errors";

export async function updateDeskAction(input: UpdateDeskInput): Promise<ActionResult<UpdateDeskResult>> {
    const { success, error } = updateDeskSchema.safeParse(input);
    if(!success){
        const appError = new ApplicationError({message: error.issues[0].message, code: AppErrorCode.VALIDATION_FAILED});
        return fail(toActionError(appError));
    }
    try {
        const useCase = await makeUpdateDeskUseCase();
        const result = await useCase.execute(input);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}