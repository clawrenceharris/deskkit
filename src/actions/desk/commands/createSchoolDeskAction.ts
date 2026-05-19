"use server";
import { makeCreateSchoolDeskUseCase } from "@/composition/desk";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult } from "@/shared/action";
import { CreateDeskResult } from "@/features/desk/application/dto";
import { fail, ok } from "@/shared/application";
import { toActionError } from "@/shared/action";

export async function createSchoolDeskAction(schoolId: string): Promise<ActionResult<CreateDeskResult>> {
    try {
        const useCase = makeCreateSchoolDeskUseCase();
        const result = await useCase.execute(schoolId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}