"use server";
import { SchoolReadService } from "@/features/school/application/services";
import { PrismaSchoolReadRepository } from "@/features/school/infrastructure/repositories";
import { School, SchoolForDetail, SchoolForPolicy } from "@/features/school/infrastructure/queries";
import { prisma } from "@/lib/db/prisma";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

function makeSchoolReadService() {
  const repository = new PrismaSchoolReadRepository(prisma);
  return new SchoolReadService(repository);
}

export async function getSchoolAction(schoolId: string): Promise<ActionResult<School | null>> {
  try {
    const result = await makeSchoolReadService().getSchoolById(schoolId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getSchoolDetailAction(schoolId: string): Promise<ActionResult<SchoolForDetail | null>> {
  try {
    const result = await makeSchoolReadService().getSchoolDetail(schoolId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getSchoolPolicyAction(schoolId: string): Promise<ActionResult<SchoolForPolicy | null>> {
  try {
    const result = await makeSchoolReadService().getSchoolPolicy(schoolId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
