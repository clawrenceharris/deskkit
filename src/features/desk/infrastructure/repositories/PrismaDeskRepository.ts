import { type Desk, deskArgs, type DeskForDetail, myDeskForDetailArgs, schoolDeskForDetailArgs } from "../queries";
import { CreateSchoolDeskInput, JoinOrLeaveDeskInput, UpdateDeskInput } from "../../application/dto";
import {  MemberRole, Prisma, PrismaClient } from "@/lib/db/prisma";
import { DeskReadRepository, DeskRepository } from "../../domain/repositories";
import { CreateDeskData } from "../types";
import { PrismaDeskReadRepository } from "./PrismaDeskReadRepository";

export class PrismaDeskRepository implements DeskRepository {
  public readonly query: DeskReadRepository;
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.query = new PrismaDeskReadRepository(prisma);
    this.prisma = prisma;
  }
  async create({name, schoolId, creatorId, isPublic, imageUrl, imagePath, description}: CreateDeskData): Promise<Desk> {
   const data: Prisma.DeskCreateInput = {
    name,
    school: { connect: { id: schoolId } },
    creator: { connect: { userId: creatorId } },
    isPublic,
    imageUrl,
    imagePath,
    description,
    members: { create: { profile: { connect: { userId: creatorId } }, role: MemberRole.OWNER } },
   };
    const newDesk = await this.prisma.desk.create({ 
      data
    });
    return newDesk;
  }


  async delete(id: string): Promise<void> {
    await this.prisma.desk.delete({
      where: { id },
    });
  }
  
  async update(input: UpdateDeskInput): Promise<Prisma.DeskGetPayload<typeof deskArgs>> {
    const { deskId, ...data } = input;
    const updatedDesk = await this.prisma.desk.update({
      where: { id: deskId },
      data,
    });
    return updatedDesk;
  } 

  async join(input: JoinOrLeaveDeskInput): Promise<void> {
    if(input?.isJoining){
      const data: Prisma.MemberCreateInput = {
        profile: { connect: { userId: input.userId } },
        desk: { connect: { id: input.deskId } },
        role: input.role === "CONTRIBUTOR" ? MemberRole.CONTRIBUTOR : input.role === "OWNER" ? MemberRole.OWNER : MemberRole.VIEWER,
      };
      await this.prisma.member.create ({ data });

    }
  }
  async leave(input: JoinOrLeaveDeskInput): Promise<void> {
    await this.prisma.member.delete({
      where: { userId_deskId: { userId: input.userId, deskId: input.deskId } },
    });
  }

  async createSchoolDesk(input: CreateSchoolDeskInput): Promise<DeskForDetail> {
    const deskData: Prisma.DeskCreateInput = {
      name: `${input.schoolName} Desk`,
      school: { connect: { id: input.schoolId } },
      isPublic: true,
      creator: { connect: { userId: "system" } },
      members: { create: { profile: { connect: { userId: "system" } }, role: MemberRole.CONTRIBUTOR } }
    };
    const desk = await this.prisma.desk.create({
      data: deskData
    })
    const data: Prisma.SchoolDeskCreateInput = {
      school: { connect: { id: input.schoolId } },
      desk: { connect: { id: desk.id } },
      
    };
    const schoolDesk = await this.prisma.schoolDesk.create({ data,
       ...schoolDeskForDetailArgs,
     });
    return schoolDesk.desk;
  }

  async createMyDesk(userId: string): Promise<DeskForDetail> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: {
        displayName: true,
        userId: true,
      },
    });
    if(!profile) {
      throw new Error("Profile not found");
    }
    const deskData: Prisma.DeskCreateInput = {
      name: `${profile.displayName}'s Desk`,
      creator: { connect: { userId: profile.userId } },
      isPublic: false,
      members: { create: { profile: { connect: { userId: profile.userId } }, role: MemberRole.OWNER } },
    };
    const desk = await this.prisma.desk.create({ data: deskData });
    const data: Prisma.UserDeskCreateInput = {
      desk: { connect: { id: desk.id } },
      user: { connect: { userId: profile.userId } },
    };
    const myDesk = await this.prisma.userDesk.create({ data, 
      ...myDeskForDetailArgs,
     });
    return myDesk.desk;
  }
 
}
