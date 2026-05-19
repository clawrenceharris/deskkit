import { Prisma, PrismaClient } from "@/lib/db/prisma";
import { ProfileReadRepository } from "../../domain/repositories";
import { Profile, profileArgs, profileForButtonArgs, profileForDetailArgs, profileForPolicyArgs } from "../queries";

export class PrismaProfileReadRepository implements ProfileReadRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getProfile(userId: string): Promise<Prisma.ProfileGetPayload<typeof profileArgs> | null> {
    return this.prisma.profile.findUnique({
      where: { userId },
      ...profileArgs,
    });
  }

  async getProfileDetail(userId: string): Promise<Prisma.ProfileGetPayload<typeof profileForDetailArgs> | null> {
    return this.prisma.profile.findUnique({
      where: { userId },
      ...profileForDetailArgs,
    });
  }

  async getProfileButton(userId: string): Promise<Prisma.ProfileGetPayload<typeof profileForButtonArgs> | null> {
    return this.prisma.profile.findUnique({
      where: { userId },
      ...profileForButtonArgs,
    });
  }

  async getProfilePolicy(userId: string): Promise<Prisma.ProfileGetPayload<typeof profileForPolicyArgs> | null> {
    return this.prisma.profile.findUnique({
      where: { userId },
      ...profileForPolicyArgs,
    });
  }
  async getByUsername(username: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { username },
      ...profileArgs,
    });
  }
}
