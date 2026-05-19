import { Prisma } from "@/lib/db/prisma";
import { notebookForCardArgs, notebookForDetailArgs } from "../../infrastructure/queries";

export interface NotebookReadRepository {
  getNotebook(notebookId: string): Promise<Prisma.NotebookGetPayload<Prisma.NotebookDefaultArgs> | null>;
  getNotebookDetail(notebookId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForDetailArgs> | null>;
  getNotebookCard(notebookId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForCardArgs> | null>;

  getNotebooks(): Promise<Prisma.NotebookGetPayload<Prisma.NotebookDefaultArgs>[]>;
  getDetailedNotebooks(): Promise<Prisma.NotebookGetPayload<typeof notebookForDetailArgs>[]>;
  getNotebookCards(): Promise<Prisma.NotebookGetPayload<typeof notebookForCardArgs>[]>;

  getNotebooksByDeskId(deskId: string): Promise<Prisma.NotebookGetPayload<Prisma.NotebookDefaultArgs>[]>;
  getDetailedNotebooksByDeskId(deskId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForDetailArgs>[]>;
  getNotebookCardsByDeskId(deskId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForCardArgs>[]>;

  getNotebooksByUserId(userId: string): Promise<Prisma.NotebookGetPayload<Prisma.NotebookDefaultArgs>[]>;
  getDetailedNotebooksByUserId(userId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForDetailArgs>[]>;
  getNotebookCardsByUserId(userId: string): Promise<Prisma.NotebookGetPayload<typeof notebookForCardArgs>[]>;
}
