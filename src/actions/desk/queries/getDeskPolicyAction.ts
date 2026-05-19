"use server";
import { ActionResult } from "@/shared/action";
import { makeGetDeskPolicyUseCase } from "@/composition/desk";
import { GetDeskPolicyInput, GetDeskPolicyResult } from "@/features/desk/application/dto";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok } from "@/shared/application";
import { toActionError } from "@/shared/action";

export async function getDeskPolicyAction(input: GetDeskPolicyInput): Promise<ActionResult<GetDeskPolicyResult>> {
    try{
        const useCase = makeGetDeskPolicyUseCase();
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