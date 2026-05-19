"use server";
import { NotebookForCard, NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { Notebook } from "@/lib/db/prisma";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { makeNotebookReadService } from "@/composition/notebook";

export async function getNotebooksByDeskAction(deskId: string): Promise<ActionResult<Notebook[]>> {
  try {
    const result = await makeNotebookReadService().getNotebooksByDeskId(deskId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getDetailedNotebooksByDeskAction(deskId: string): Promise<ActionResult<NotebookForDetail[]>> {
  try {
    const result = await makeNotebookReadService().getDetailedNotebooksByDeskId(deskId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getNotebookCardsByDeskAction(deskId: string): Promise<ActionResult<NotebookForCard[]>> {
  try {
    const result = await makeNotebookReadService().getNotebookCardsByDeskId(deskId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
