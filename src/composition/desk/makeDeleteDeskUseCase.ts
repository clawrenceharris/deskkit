import { DeleteDeskUseCase } from "@/features/desk/application/use-cases";
import { prisma } from "@/lib/db/prisma";
import { PrismaDeskRepository } from "@/features/desk/infrastructure/repositories";

export function makeDeleteDeskUseCase(): DeleteDeskUseCase {
    const repository = new PrismaDeskRepository(prisma);
    return new DeleteDeskUseCase(repository);
}