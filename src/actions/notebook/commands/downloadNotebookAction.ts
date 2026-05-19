"use server";

import { makeDownloadNotebookUseCase } from "@/composition/notebook";
import { ActionResult } from "@/shared/action";
import { DownloadNotebookInput } from "@/features/notebook/application/dto";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok } from "@/shared/application";
import { toActionError } from "@/shared/action";

export async function downloadNotebookAction(input: DownloadNotebookInput):Promise<ActionResult<void>> {
  try{
    const useCase = await makeDownloadNotebookUseCase();
    const result = await useCase.execute(input);
    if(!result.success){
      return fail(result.error);
    }
    return ok(undefined);
  }
  catch(error){
    const appError = ApplicationError.unexpected(error);
    return fail(toActionError(appError));
  }
}