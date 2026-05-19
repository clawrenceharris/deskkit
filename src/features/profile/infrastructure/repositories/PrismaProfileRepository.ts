import { ProfileRepository } from "../../domain/repositories";
import { CreateOrUpdateProfileData } from "./types";
import {  ProfileForDetail, profileForDetailArgs } from "../queries";
import { PrismaClient } from "@/lib/db/prisma"; 
import { ProfileReadRepository } from "../../domain/repositories";
import { PrismaProfileReadRepository } from "./PrismaProfileReadRepository";

export class PrismaProfileRepository implements ProfileRepository {
    public readonly query: ProfileReadRepository;
    constructor(private readonly prisma: PrismaClient) {
        this.query = new PrismaProfileReadRepository(prisma);
    }
   
    async create(data: CreateOrUpdateProfileData): Promise<ProfileForDetail> {
        const newProfile = await this.prisma.profile.create({
            data,
            ...profileForDetailArgs,
        });
        return newProfile;
    }
   
    async update(data: CreateOrUpdateProfileData): Promise<ProfileForDetail> {
       
        const newProfile = await this.prisma.profile.update({
            where: { userId: data.userId },
            data,
            ...profileForDetailArgs,
        });
        return newProfile;
    }
    async delete(userId: string): Promise<void> {
        await this.prisma.profile.delete({
            where: { userId },
        });
    }
   
    async existsByUserId(userId: string): Promise<boolean> {
        const profile = await this.prisma.profile.findFirst({
            where: { userId },
        });
        return profile ? true : false;
    }
    async existsByUsername(username: string): Promise<boolean> {
        const profile = await this.prisma.profile.findFirst({
            where: { username },
        });
        return profile ? true : false;
    }
    

    async upsert(data: CreateOrUpdateProfileData): Promise<ProfileForDetail> {
        const newProfile = await this.prisma.profile.upsert({
            where: { userId: data.userId },
            update: data,
            create: data,
            ...profileForDetailArgs,
        });
        return newProfile;
    }
}