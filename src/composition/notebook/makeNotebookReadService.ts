import { NotebookReadService } from "@/features/notebook/application/services";
import { PrismaNotebookReadRepository } from "@/features/notebook/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeNotebookReadService() {
  const repository = new PrismaNotebookReadRepository(prisma);
  return new NotebookReadService(repository);
}