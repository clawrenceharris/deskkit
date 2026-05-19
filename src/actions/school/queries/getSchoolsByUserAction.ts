"use server";
import { SchoolReadService } from "@/features/school/application/services";
import { PrismaSchoolReadRepository } from "@/features/school/infrastructure/repositories";
import { School, SchoolForDetail } from "@/features/school/infrastructure/queries";
import { prisma } from "@/lib/db/prisma";
import { ApplicationError } from "@/shared/utils/errors";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

function makeSchoolReadService() {
  const repository = new PrismaSchoolReadRepository(prisma);
  return new SchoolReadService(repository);
}

export async function getSchoolsByUserAction(userId: string): Promise<ActionResult<School[]>> {
  try {
    const result = await makeSchoolReadService().getSchoolsByUserId(userId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}

export async function getDetailedSchoolsByUserAction(userId: string): Promise<ActionResult<SchoolForDetail[]>> {
  try {
    const result = await makeSchoolReadService().getDetailedSchoolsByUserId(userId);
    if (!result.success) return fail(toActionError(result.error));
    return ok(result.data);
  } catch (error) {
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
