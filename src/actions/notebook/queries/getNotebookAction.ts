"use server";
import { NotebookForCard, NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { Notebook } from "@/lib/db/prisma";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { makeNotebookReadService } from "@/composition/notebook";

export async function getNotebookAction(notebookId: string): Promise<ActionResult<Notebook | null>> {
  try {
    const result = await makeNotebookReadService().getNotebookById(notebookId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getNotebookDetailAction(notebookId: string): Promise<ActionResult<NotebookForDetail | null>> {
  try {
    const result = await makeNotebookReadService().getNotebookDetail(notebookId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getNotebookCardAction(notebookId: string): Promise<ActionResult<NotebookForCard | null>> {
  try {
    const result = await makeNotebookReadService().getNotebookCard(notebookId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
