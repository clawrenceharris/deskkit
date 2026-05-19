"use server";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { Desk, DeskForCard, DeskForDetail } from "@/features/desk/infrastructure/queries";
import { makeDeskReadService } from "@/composition/desk";

export async function getDeskAction(
    deskId: string,
): Promise<ActionResult<Desk | null>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getDeskById(deskId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}
export async function getDeskDetailAction(
    deskId: string,
): Promise<ActionResult<DeskForDetail | null>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getDeskDetail(deskId);
        console.log("result!",result);
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

export async function getDeskCardAction(
    deskId: string,
): Promise<ActionResult<DeskForCard | null>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getDeskCard(deskId);
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