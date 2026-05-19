"use server";
import { makeCreateDeskUseCase } from "@/composition/desk";
import { ActionResult, toActionError } from "@/shared/action";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok } from "@/shared/application";
import { CreateDeskResult, CreateDeskInput } from "@/features/desk/application/dto";

/**
 * Creates a new desk
 * @param userId - The ID of the user creating the desk
 * @param data - The form values for creating a desk
 * @returns {ActionResultWithData} - The result of the create desk action
 */
export async function createDeskAction(input: CreateDeskInput): Promise<ActionResult<CreateDeskResult>> {
    try {
      const useCase = await makeCreateDeskUseCase();
      const result = await useCase.execute(input);
      if(!result.success){
        return fail(toActionError(result.error));
      }
      return ok(result.data);
    } catch (error) {   
      const appError = ApplicationError.unexpected(error);
      return { success: false as const, error: toActionError(appError) };
    }
}
 
 