"use server";
import { Desk } from "@/features/desk/infrastructure/queries";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok } from "@/shared/application";
import { ActionResult, toActionError } from "@/shared/action";
import { DeskForCard, DeskForDetail } from "@/features/desk/infrastructure/queries";
import { makeDeskReadService } from "@/composition/desk";

export async function getSchoolDeskAction(schoolId: string): Promise<ActionResult<Desk | null>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getSchoolDesk(schoolId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return { success: false, error: toActionError(appError) };
    }
}

export async function getSchoolDeskDetailAction(schoolId: string): Promise<ActionResult<DeskForDetail | null>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getSchoolDeskDetail(schoolId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}

export async function getSchoolDeskCardAction(schoolId: string): Promise<ActionResult<DeskForCard | null>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getSchoolDeskCard(schoolId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}