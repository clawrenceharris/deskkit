"use server"
import { joinOrLeaveDeskUseCase } from "@/composition/desk";
import { JoinOrLeaveDeskInput } from "@/features/desk/application/dto";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

export async function joinOrLeaveDeskAction(input: JoinOrLeaveDeskInput): Promise<ActionResult<void>> {
    try {
        const useCase = joinOrLeaveDeskUseCase();
        const result = await useCase.execute(input);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(undefined);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}