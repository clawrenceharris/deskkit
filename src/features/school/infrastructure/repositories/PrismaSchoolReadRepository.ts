import { Prisma, PrismaClient } from "@/lib/db/prisma";
import { SchoolReadRepository } from "../../domain/repositories";
import { School, schoolForDetailArgs, schoolForPolicyArgs } from "../queries";

export class PrismaSchoolReadRepository implements SchoolReadRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getSchool(schoolId: string): Promise<Prisma.SchoolGetPayload<Prisma.SchoolDefaultArgs> | null> {
    return this.prisma.school.findUnique({
      where: { id: schoolId },
    });
  }

  async getSchoolDetail(schoolId: string): Promise<Prisma.SchoolGetPayload<typeof schoolForDetailArgs> | null> {
    return this.prisma.school.findUnique({
      where: { id: schoolId },
      ...schoolForDetailArgs,
    });
  }

  async getSchoolPolicy(schoolId: string): Promise<Prisma.SchoolGetPayload<typeof schoolForPolicyArgs> | null> {
    return this.prisma.school.findUnique({
      where: { id: schoolId },
      ...schoolForPolicyArgs,
    });
  }

  async getSchools(): Promise<Prisma.SchoolGetPayload<Prisma.SchoolDefaultArgs>[]> {
    return this.prisma.school.findMany();
  }

  async getDetailedSchools(): Promise<Prisma.SchoolGetPayload<typeof schoolForDetailArgs>[]> {
    return this.prisma.school.findMany({
      ...schoolForDetailArgs,
    });
  }

  async getPolicySchools(): Promise<Prisma.SchoolGetPayload<typeof schoolForPolicyArgs>[]> {
    return this.prisma.school.findMany({
      ...schoolForPolicyArgs,
    });
  }

  async getSchoolsByUserId(userId: string): Promise<Prisma.SchoolGetPayload<Prisma.SchoolDefaultArgs>[]> {
    return this.prisma.school.findMany({
      where: {
        students: { some: { userId } },
      },
    });
  }

  async getDetailedSchoolsByUserId(userId: string): Promise<Prisma.SchoolGetPayload<typeof schoolForDetailArgs>[]> {
    return this.prisma.school.findMany({
      where: {
        students: { some: { userId } },
      },
      ...schoolForDetailArgs,
    });
  }
  async getSchoolsByName(name: string): Promise<School[]> {
    return this.prisma.school.findMany({
      where: { name: { equals: name, mode: "insensitive" } },
    });
  }
}
