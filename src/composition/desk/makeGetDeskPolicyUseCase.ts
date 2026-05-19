import { prisma } from "@/lib/db/prisma";
import { DeskPolicyProvider } from "@/features/desk/infrastructure/providers";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { PrismaSchoolRepository } from "@/features/school/infrastructure/repositories";
import { PrismaDeskRepository } from "@/features/desk/infrastructure/repositories";
import { GetDeskPolicyUseCase } from "@/features/desk/application/use-cases";

export function makeGetDeskPolicyUseCase() {
    const profileRepository = new PrismaProfileRepository(prisma);
    const schoolRepository = new PrismaSchoolRepository(prisma);
    const deskRepository = new PrismaDeskRepository(prisma);
    const deskPolicyProvider = new DeskPolicyProvider(profileRepository, schoolRepository, deskRepository, prisma);
    return new GetDeskPolicyUseCase(deskPolicyProvider);
}