"use server";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok } from "@/shared/application";
import { ActionResult, toActionError } from "@/shared/action";
import { Desk, DeskForCard, DeskForDetail } from "@/features/desk/infrastructure/queries";
import { makeDeskReadService } from "@/composition/desk";

export async function getJoinedDesksAction(userId: string): Promise<ActionResult<Desk[]>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getJoinedDesks(userId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}

export async function getJoinedDesksDetailAction(userId: string): Promise<ActionResult<DeskForDetail[]>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getJoinedDesksDetail(userId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    }
    catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
    
}
export async function getJoinedDesksCardAction(userId: string): Promise<ActionResult<DeskForCard[]>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getJoinedDesksCard(userId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    }
    catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}
