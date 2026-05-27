import { prisma } from "@/lib/db/prisma";
import { PrismaNotebookRepository } from "@/features/notebook/infrastructure/repositories";
import { GetNotebookPolicyUseCase } from "@/features/notebook/application/use-cases";
import { PrismaNotebookPolicyProvider } from "@/features/notebook/infrastructure/providers";

export function makeGetNotebookPolicyUseCase() {
    const repository = new PrismaNotebookRepository(prisma);
    const notebookPolicyProvider = new PrismaNotebookPolicyProvider(repository);
    return new GetNotebookPolicyUseCase(notebookPolicyProvider);

}