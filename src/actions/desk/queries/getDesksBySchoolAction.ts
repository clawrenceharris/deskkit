"use server";
import { Desk, DeskForCard, DeskForDetail } from "@/features/desk/infrastructure/queries";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { makeDeskReadService } from "@/composition/desk";

export async function getDesksBySchoolAction(
    schoolId: string,
): Promise<ActionResult<Desk[]>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getDesksBySchoolId(schoolId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }

    
}


export async function getDetailedDesksBySchoolAction(
    schoolId: string,
): Promise<ActionResult<DeskForDetail[]>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getDesksDetailBySchoolId(schoolId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }

    
}

export async function getDeskCardsBySchoolAction(
    schoolId: string,
): Promise<ActionResult<DeskForCard[]>> {
    try {
        const service = makeDeskReadService();
        const result = await service.getDeskCardsBySchoolId(schoolId);
        if(!result.success){
            return fail(toActionError(result.error));
        }
        return ok(result.data);
    } catch (error) {
        const appError = ApplicationError.unexpected(error);
        return fail(toActionError(appError));
    }
}
