"use server";

import { getCurrentUser } from "@/actions/auth";
import { getPresenceService } from "@/features/presence/infrastructure/PresenceService";
import type { ResolvedActivityStatus } from "@/features/presence/domain/types";
import { fail, ok } from "@/shared/application";
import { ActionResult } from "@/shared/action";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types/errors";

export async function getActivityStatusesAction(
  userIds: string[],
): Promise<ActionResult<Record<string, ResolvedActivityStatus>>> {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return fail(userResult.error);
    }

    if (!userResult.data) {
      return fail(new ApplicationError({ code: AppErrorCode.PERMISSION_DENIED }));
    }

    const presence = getPresenceService();
    const statuses = await presence.getStatuses(userIds);
    return ok(statuses);
  } catch (error) {
    return fail(ApplicationError.unexpected(error));
  }
}
