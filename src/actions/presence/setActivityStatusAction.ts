"use server";

import { getCurrentUser } from "@/actions/auth";
import { getPresenceService } from "@/features/presence/infrastructure/PresenceService";
import type {
  ManualActivityStatus,
  ResolvedActivityStatus,
} from "@/features/presence/domain/types";
import { fail, ok } from "@/shared/application";
import { ActionResult } from "@/shared/action";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types/errors";

export type SetActivityStatusInput = {
  status: ManualActivityStatus;
  durationMinutes?: number | null;
};

export async function setActivityStatusAction(
  input: SetActivityStatusInput,
): Promise<ActionResult<ResolvedActivityStatus>> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return fail(userResult.error);
    }

    const userId = userResult.data?.id;
    if (!userId) {
      return fail(new ApplicationError({ code: AppErrorCode.PERMISSION_DENIED }));
    }

    const presence = getPresenceService();
    const resolved = await presence.setManualStatus(
      userId,
      input.status,
      input.durationMinutes,
    );

    return ok(resolved);
  } catch (error) {
    return fail(ApplicationError.unexpected(error));
  }
}
