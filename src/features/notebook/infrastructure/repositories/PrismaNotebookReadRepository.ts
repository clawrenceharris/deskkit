import { Prisma, PrismaClient } from "@/lib/db/prisma";
import { NotebookReadRepository } from "../../domain/repositories";
import { notebookForCardArgs, notebookForDetailArgs } from "../queries";

export class PrismaNotebookReadRepository implements NotebookReadRepository {
  constructor(private readonly prisma: PrismaClient) {
  }

  async getNotebook(notebookId: string): Promise<Prisma.NotebookGetPayload<Prisma.NotebookDefaultArgs> | null> {
    return this.prisma.notebook.findUnique({
      where: { id: notebookId },
    });
  }

  async getNotebookDetail(notebookId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForDetailArgs> | null> {
    return this.prisma.notebook.findUnique({
      where: { id: notebookId },
      ...notebookForDetailArgs,
    });
  }

  async getNotebookCard(notebookId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForCardArgs> | null> {
    return this.prisma.notebook.findUnique({
      where: { id: notebookId },
      ...notebookForCardArgs,
    });
  }

  async getNotebooks(): Promise<Prisma.NotebookGetPayload<Prisma.NotebookDefaultArgs>[]> {
    return this.prisma.notebook.findMany();
  }

  async getDetailedNotebooks(): Promise<Prisma.NotebookGetPayload<typeof notebookForDetailArgs>[]> {
    return this.prisma.notebook.findMany({
      ...notebookForDetailArgs,
    });
  }

  async getNotebookCards(): Promise<Prisma.NotebookGetPayload<typeof notebookForCardArgs>[]> {
    return this.prisma.notebook.findMany({
      ...notebookForCardArgs,
    });
  }

  async getNotebooksByDeskId(deskId: string): Promise<Prisma.NotebookGetPayload<Prisma.NotebookDefaultArgs>[]> {
    return this.prisma.notebook.findMany({
      where: { deskId },
    });
  }

  async getDetailedNotebooksByDeskId(deskId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForDetailArgs>[]> {
    return this.prisma.notebook.findMany({
      where: { deskId },
      ...notebookForDetailArgs,
    });
  }

  async getNotebookCardsByDeskId(deskId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForCardArgs>[]> {
    return this.prisma.notebook.findMany({
      where: { deskId },
      ...notebookForCardArgs,
    });
  }

  async getNotebooksByUserId(userId: string): Promise<Prisma.NotebookGetPayload<Prisma.NotebookDefaultArgs>[]> {
    return this.prisma.notebook.findMany({
      where: { creatorId: userId },
    });
  }

  async getDetailedNotebooksByUserId(userId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForDetailArgs>[]> {
    return this.prisma.notebook.findMany({
      where: { creatorId: userId },
      ...notebookForDetailArgs,
    });
  }

  async getNotebookCardsByUserId(userId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForCardArgs>[]> {
    return this.prisma.notebook.findMany({
      where: { creatorId: userId },
      ...notebookForCardArgs,
    });
  }
}
