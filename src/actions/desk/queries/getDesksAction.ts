"use server";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok } from "@/shared/application";
import { ActionResult, toActionError } from "@/shared/action";
import { Desk, DeskForCard, DeskForDetail } from "@/features/desk/infrastructure/queries";
import { makeDeskReadService } from "@/composition/desk";

export async function getDesksAction(): Promise<ActionResult<Desk[]>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getDesks();
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}

export async function getDetailedDesksAction(): Promise<ActionResult<DeskForDetail[]>> {
    try{
        const service = makeDeskReadService();
        const result = await service.getDesksDetail();
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    }
    catch(error){
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}

export async function getDeskCardsAction(): Promise<ActionResult<DeskForCard[]>> {
    try{
        const service = makeDeskReadService();
        const result = await service.getDeskCards();
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    }
    catch(error){
            const appError = ApplicationError.unexpected(error);
            return fail(toActionError(appError));
    }   
}