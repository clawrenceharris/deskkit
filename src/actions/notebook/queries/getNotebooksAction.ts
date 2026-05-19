"use server";
import { Notebook } from "@/lib/db/prisma";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { NotebookForCard, NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { makeNotebookReadService } from "@/composition/notebook";
export async function getNotebooksAction(): Promise<ActionResult<Notebook[]>> {
  try {
    const result = await makeNotebookReadService().getNotebooks();
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getDetailedNotebooksAction(): Promise<ActionResult<NotebookForDetail[]>> {
  try {
    const result = await makeNotebookReadService().getDetailedNotebooks();
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getNotebookCardsAction(): Promise<ActionResult<NotebookForCard[]>> {
  try {
    const result = await makeNotebookReadService().getNotebookCards();
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
