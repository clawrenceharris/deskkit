"use server";
import { fail, ok } from "@/shared/application";
import { ActionResult, toActionError } from "@/shared/action";
import { ApplicationError } from "@/shared/utils/errors";
import { Desk, DeskForCard, DeskForDetail } from "@/features/desk/infrastructure/queries";
import { makeDeskReadService } from "@/composition/desk";

export async function getDesksByCreatorAction(
    userId: string,
): Promise<ActionResult<Desk[]>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getDesksByCreatorId(userId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}
export async function getDetailedDesksByCreatorAction(
    userId: string,
): Promise<ActionResult<DeskForDetail[]>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getDesksDetailByCreator(userId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}

export async function getDeskCardsByCreatorAction(
    userId: string,
): Promise<ActionResult<DeskForCard[]>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getDeskCardsByCreatorId(userId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}