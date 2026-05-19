import { NotebookRepository } from "../../domain/repositories";
import { NotebookForDetail, notebookForDetailArgs, NotebookVote, notebookVoteArgs } from "../queries";
import { Prisma, PrismaClient } from "@/lib/db/prisma";
import { CreateNotebookData, UpdateNotebookData, VoteNotebookData, RemoveVoteData } from "./types";
import { DownloadNotebookInput } from "../../application/dto";
import { NotebookReadRepository } from "../../domain/repositories";
import { PrismaNotebookReadRepository } from "./PrismaNotebookReadRepository";

export class PrismaNotebookRepository implements NotebookRepository {
    public readonly query: NotebookReadRepository;
    constructor(private readonly prisma: PrismaClient) {
        this.query = new PrismaNotebookReadRepository(prisma);
    }

    async create(input: CreateNotebookData): Promise<NotebookForDetail> {
        const data: Prisma.NotebookCreateInput = {
            title: input.title,
            description: input.description,
            desk: { connect: { id: input.deskId } },
            materials: { create: input.materials },
            creator: { connect: { userId: input.creatorId } },
        };
        const newNotebook = await this.prisma.notebook.create({ data, ...notebookForDetailArgs });
        return newNotebook;
    }
    async update(input: UpdateNotebookData): Promise<NotebookForDetail> {
        const data: Prisma.NotebookUpdateInput = {
            title: input.title,
            description: input.description,
        };
        if ((input.materialsToCreate?.length ?? 0) > 0 || (input.materialIdsToDelete?.length ?? 0) > 0) {
            data.materials = {
                ...(input.materialsToCreate?.length
                    ? { create: input.materialsToCreate }
                    : {}),
                ...(input.materialIdsToDelete?.length
                    ? { deleteMany: { id: { in: input.materialIdsToDelete } } }
                    : {}),
            };
        }
        const updated = await this.prisma.notebook.update({
            where: { id: input.notebookId },
            data,
            ...notebookForDetailArgs,
        });
        return updated;
    }
   
  
    async delete(id: string): Promise<NotebookForDetail> {
        const deleted = await this.prisma.notebook.delete({
            where: { id },
            ...notebookForDetailArgs,
        });
        return deleted;
    }
    async vote(data: VoteNotebookData): Promise<void> {
        

        await this.prisma.vote.upsert({
            where: {

                userId_notebookId: {
                    userId: data.userId,
                    notebookId: data.notebookId,
                },
                notebookId: data.notebookId,
            },
            create: {
                userId: data.userId,
                notebookId: data.notebookId,
                isUpvote: data.isUpvote,
            },
            update: {
                isUpvote: data.isUpvote,
            },
        });
    }
    async removeVote(data: RemoveVoteData): Promise<void> {
        await this.prisma.vote.delete({
            where: { userId_notebookId: { userId: data.userId, notebookId: data.notebookId } },
        });
    }

    async getVotesByNotebookId(notebookId: string): Promise<NotebookVote[]> {
        return this.prisma.vote.findMany({
            where: { notebookId: notebookId },
            ...notebookVoteArgs,
        });
    }
    async downloadNotebook(input: DownloadNotebookInput): Promise<void> {
        await this.prisma.download.upsert({
            where: { userId_notebookId: { userId: input.userId, notebookId: input.notebookId } },
            create: {
                userId: input.userId,
                notebookId: input.notebookId,
            },
            update: {
                createdAt: new Date(),
            },

        });
    }

}