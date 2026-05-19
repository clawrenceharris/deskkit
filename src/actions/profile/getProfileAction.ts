"use server";

import { ActionResult, toActionError } from "@/shared/action";
import { Profile, ProfileForButton, ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { makeProfileReadService } from "@/composition/profile";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";

export async function getProfileAction(
    userId: string,
): Promise<ActionResult<Profile | null>> {
    try{
    const service = makeProfileReadService();
    const result = await service.getProfile(userId);
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

export async function getDetailedProfileAction(
    userId: string,
): Promise<ActionResult<ProfileForDetail | null>> {
    try{
        const service = makeProfileReadService();
        const result = await service.getProfileDetail(userId);
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

export async function getProfileButtonAction(
    userId: string,
): Promise<ActionResult<ProfileForButton | null>> {
    try{
        const service = makeProfileReadService();
        const result = await service.getProfileButton(userId);
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