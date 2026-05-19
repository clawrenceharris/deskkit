"use server";
import { makeVoteNotebookUseCase } from "@/composition/notebook";
import { ApplicationError } from "@/shared/utils/errors";
import { VoteNotebookInput } from "@/features/notebook/application/dto";
import { ActionResult, toActionError } from "@/shared/action";
import { ok, fail } from "@/shared/application";
export async function voteNotebookAction(input: VoteNotebookInput): Promise<ActionResult<void>> {
    try {
        const useCase = await makeVoteNotebookUseCase();
        const result = await useCase.execute(input);
        if(!result.success){
            return fail(result.error);
        }
        return ok(undefined);
    } 
    catch (error) {
        console.error("Error voting notebook", error);
        return fail(toActionError(ApplicationError.unexpected(error)));
    }
}