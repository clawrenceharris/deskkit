"use server";
import { ProfileReadService } from "@/features/profile/application/services";
import { PrismaProfileReadRepository } from "@/features/profile/infrastructure/repositories";
import { Profile, ProfileForButton, ProfileForDetail, ProfileForPolicy } from "@/features/profile/infrastructure/queries";
import { prisma } from "@/lib/db/prisma";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

function makeProfileReadService() {
  const repository = new PrismaProfileReadRepository(prisma);
  return new ProfileReadService(repository);
}

export async function getProfileAction(userId: string): Promise<ActionResult<Profile | null>> {
  try {
    const result = await makeProfileReadService().getProfile(userId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getProfileDetailAction(userId: string): Promise<ActionResult<ProfileForDetail | null>> {
  try {
    const result = await makeProfileReadService().getProfileDetail(userId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getProfileButtonAction(userId: string): Promise<ActionResult<ProfileForButton | null>> {
  try {
    const result = await makeProfileReadService().getProfileButton(userId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getProfilePolicyAction(userId: string): Promise<ActionResult<ProfileForPolicy | null>> {
  try {
    const result = await makeProfileReadService().getProfilePolicy(userId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
