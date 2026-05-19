"use server";
import { makeCheckUsernameAvailabilityUseCase } from "@/composition/profile";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
import { CheckUsernameResult } from "@/features/profile/application/dto";

export async function checkUsernameAction(username: string, userId: string): Promise<ActionResult<CheckUsernameResult>> {
   try{
      const checkUsernameAvailabilityUseCase =  makeCheckUsernameAvailabilityUseCase();
      const result = await checkUsernameAvailabilityUseCase.execute(username, userId);
      if(!result.success) {
         return fail(result.error);
      }
      return ok(result.data);
   } 
   catch (error) {
      const appError = ApplicationError.unexpected(error);
      return fail(toActionError(appError));
   }
}