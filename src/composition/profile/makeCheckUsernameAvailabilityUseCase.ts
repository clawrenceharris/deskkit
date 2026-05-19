import { prisma } from "@/lib/db/prisma";
import { CheckUsernameUseCase } from "@/features/profile/application/use-cases/CheckUsernameUseCase";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories/PrismaProfileRepository";

export function makeCheckUsernameAvailabilityUseCase() {
    const userProfileRepository = new PrismaProfileRepository(prisma);
    return new CheckUsernameUseCase(userProfileRepository);
}