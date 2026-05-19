import { DeskReadRepository } from "../../domain/repositories";
import { PrismaClient } from "@/lib/db/prisma";
import {deskForDetailArgs, myDeskForDetailArgs, deskForCardArgs, deskArgs, DeskForDetail, Desk, DeskForCard } from "../queries";

export class PrismaDeskReadRepository implements DeskReadRepository {
    constructor(private readonly prisma: PrismaClient) {}
   
    async getJoinedDesksDetail(userId: string): Promise<DeskForDetail[]> {
        const joinedDesks = await this.prisma.desk.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            ...deskForDetailArgs,
        });
        return joinedDesks;
    }
    async getJoinedDesks(userId: string): Promise<Desk[]> {
        const joinedDesks = await this.prisma.desk.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            ...deskArgs,

        });
        return joinedDesks;
    }
    async getDeskDetail(deskId: string): Promise<DeskForDetail | null> {
        const desk = await this.prisma.desk.findUnique({
            where: { id: deskId },
            ...deskForDetailArgs,
            
        });
        return desk ?? null;
    }
    async getMyDeskDetail(userId: string): Promise<DeskForDetail | null> {
        const myDesk = await this.prisma.userDesk.findUnique({
            where: { userId },
            ...myDeskForDetailArgs,
        });
        return myDesk?.desk ?? null;
    }
    async getDetailedSchoolDesk(schoolId: string): Promise<DeskForDetail | null> {
        const schoolDesk = await this.prisma.schoolDesk.findUnique({
            where: { schoolId },
            include: {
                desk: {
                    ...deskForDetailArgs,
                }
            },
        });
        return schoolDesk?.desk ?? null;
    }
    async getSchoolDesk(schoolId: string): Promise<Desk | null> {
        const schoolDesk = await this.prisma.schoolDesk.findUnique({
            where: { schoolId },
            include: {
                desk: {
                    ...deskArgs,
                }
            },  
        });
        return schoolDesk?.desk ?? null;
    }
    async getDesksDetail(): Promise<DeskForDetail[]> {
        const desks = await this.prisma.desk.findMany({
            ...deskForDetailArgs,
        });
        return desks;
    }
    async getDesksDetailByCreator(userId: string): Promise<DeskForDetail[]> {
        const desks = await this.prisma.desk.findMany({
            where: { creatorId: userId },
            ...deskForDetailArgs,
        });
        return desks;
    }
    async getDesksDetailBySchool(schoolId: string): Promise<DeskForDetail[]> {
        const desks = await this.prisma.desk.findMany({
            where: { schoolId },
            ...deskForDetailArgs,
        });
        return desks;
    }
    async getDeskCard(deskId: string): Promise<DeskForCard | null> {
        const desk = await this.prisma.desk.findUnique({
            where: { id: deskId },
            ...deskForCardArgs,
        });
        return desk ?? null;
    }
    async getMyDeskCard(userId: string): Promise<DeskForCard | null> {
            const myDesk = await this.prisma.userDesk.findUnique({
            where: { userId },
            include: {
                desk: {
                    ...deskForCardArgs,
                }
            },
        });
        return myDesk?.desk ?? null;
    }
    async getSchoolDeskCard(schoolId: string): Promise<DeskForCard | null> {
        const schoolDesk = await this.prisma.schoolDesk.findUnique({
            where: { schoolId },
            include: {
                desk: {
                    ...deskForCardArgs,
                }
            },
        });
        return schoolDesk?.desk ?? null;
    }
    async getDesksCard(): Promise<DeskForCard[]> {
        const desks = await this.prisma.desk.findMany({
            ...deskForCardArgs,
        });
        return desks;
    }
    async getDesksCardByCreator(userId: string): Promise<DeskForCard[]> {
        const desks = await this.prisma.desk.findMany({
            where: { creatorId: userId },
            ...deskForCardArgs,
        });
        return desks;
    }
    async getDesksCardBySchool(schoolId: string): Promise<DeskForCard[]> {
        const desks = await this.prisma.desk.findMany({
            where: { schoolId },
            ...deskForCardArgs,
        });
        return desks;
    }
    async getJoinedDesksCard(userId: string): Promise<DeskForCard[]> {
        const joinedDesks = await this.prisma.desk.findMany({
            where: {
                members: {
                    some: { userId },
                },
            },
            ...deskForCardArgs,
        });
        return joinedDesks
    }
    async getDesk(deskId: string): Promise<Desk | null> {
        const desk = await this.prisma.desk.findUnique({
            where: { id: deskId },
            ...deskArgs,
        });
        return desk;
    }
    async getMyDesk(userId: string): Promise<Desk | null> {
        const myDesk = await this.prisma.userDesk.findUnique({
            where: { userId },
           include: {
            desk: {
                ...deskArgs,
            }
           },
        });
        return myDesk?.desk ?? null;
    }
    async getDesks(): Promise<Desk[]> {
        const desks = await this.prisma.desk.findMany({
            ...deskArgs,
        });
        return desks;
    }
    async getDesksByCreator(userId: string): Promise<Desk[]> {
        const desks = await this.prisma.desk.findMany({
            where: { creatorId: userId },
            ...deskArgs,
        });
        return desks;
    }
    async getDesksBySchool(schoolId: string): Promise<Desk[]> {
        const desks = await this.prisma.desk.findMany({
            where: { schoolId },
            ...deskArgs,
        });
        return desks;
    }

}