import { Prisma, PrismaClient } from "@/lib/db/prisma";
import { SchoolReadRepository, SchoolRepository } from "../../domain/repositories";
import { SchoolForDetail, schoolForDetailArgs } from "../queries";
import { CreateSchoolInput, UpdateSchoolInput } from "../../application/dto";
import { PrismaSchoolReadRepository } from "./PrismaSchoolReadRepository";

export class PrismaSchoolRepository implements SchoolRepository {
    public readonly query: SchoolReadRepository;
    constructor(private readonly prisma: PrismaClient) {
        this.query = new PrismaSchoolReadRepository(prisma);
    }

    async createSchool(input: CreateSchoolInput): Promise<SchoolForDetail> {
        const data: Prisma.SchoolCreateInput = {
            name: input.name,
            students: {
                connect: input.students.map(student => ({
                    userId: student.userId,
                })),
            },
            desks: {
                connect: input.desks.map(desk => ({
                    id: desk.id,
                })),
            },
        };
        const newSchool = await this.prisma.school.create({
            data,
            ...schoolForDetailArgs,
        });
        return newSchool;
    }
    
    async updateSchool(input: UpdateSchoolInput): Promise<SchoolForDetail> {
        const data: Prisma.SchoolUpdateInput = {
            ...input,
            students: {
                connect: input.students?.map(student => ({
                    userId: student.userId,
                })),
            },
            desks: {
                connect: input.desks?.map(desk => ({
                    id: desk.id,
                })),
            },
            
        };
        const updatedSchool = await this.prisma.school.update({
            where: { id: input.id },
            data,
            ...schoolForDetailArgs,
        });
        return updatedSchool;
    }
    
    async deleteSchool(id: string): Promise<void> {
        await this.prisma.school.delete({
            where: { id },
        });
    }
}