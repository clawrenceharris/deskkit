import { DeskReadService } from "@/features/desk/application/services";
import { PrismaDeskReadRepository } from "@/features/desk/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeDeskReadService() {
    const repository = new PrismaDeskReadRepository(prisma);
    return new DeskReadService(repository);
}