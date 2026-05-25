import { GetDeskPolicyResult } from "../../application/dto";
import { MemberRole, PrismaClient } from "@/lib/db/prisma";
import { ProfileRepository } from "@/features/profile/domain/repositories";
import { SchoolRepository } from "@/features/school/domain/repositories";
import { DeskRepository } from "../../domain/repositories";
import { GetDeskPolicyData } from "../types";
import { DeskPolicyService, MyDeskPolicy, SchoolDeskPolicy } from "../../domain/services";
import { DeskPolicyProviderInterface } from "../../domain/interfaces";
import { DeskContent } from "../../domain/entities";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";

export class DeskPolicyProvider implements DeskPolicyProviderInterface {
    async getDeskPolicy(data: GetDeskPolicyData): Promise<GetDeskPolicyResult> {
        try {
            const permission = await this.makeDeskPolicy(data);
            return {
                canPreview: permission.canPreview(),
                canView: permission.canView(),
                canDelete: permission.canDelete(),
                canUpdate: permission.canUpdate(),
                canPost: permission.canPost(),
                canJoin: permission.canJoin(),
            };
        } catch (error) {
            throw ApplicationError.unexpected(error);
        }
    }
    constructor(private readonly profileRepository: ProfileRepository, private readonly schoolRepository: SchoolRepository, private readonly deskRepository: DeskRepository, private readonly prisma: PrismaClient)
    {}
    private async getUserRole(data: GetDeskPolicyData): Promise<MemberRole | null> {
        if(!data.userId || !data.deskId) return null;
        const member = await this.prisma.member.findUnique({
            where: { userId_deskId: { userId: data.userId, deskId: data.deskId } },
            select: { role: true }
        });
        return member?.role ?? null;
    }
    private async makeDeskPolicy(data: GetDeskPolicyData): Promise<DeskPolicyService> {
        const role = await this.getUserRole(data);
        const user = await this.profileRepository.query.getProfilePolicy(data.userId);
        const desk = await this.deskRepository.query.getDeskDetail(data.deskId);

        if(!desk || !user){
            throw new ApplicationError({code: AppErrorCode.RESOURCE_NOT_FOUND, message: "Desk or user not found"});
        }
       
        // If the desk is the user's my desk
        if(desk.id === user.myDesk?.deskId){
            return new MyDeskPolicy(role, desk, user);
        }
        
        return new DeskPolicyService(role, desk, user);
    }
    /**
     *  Generic helper method for retrieving a resource (e.g. notebook, question, chalkboard message) from the Desk
     */ 
    private async getContent(data: GetDeskPolicyData): Promise<DeskContent | null> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let content: any = null;
        const { resourceId, deskId, resourceType } = data;
        switch (resourceType) {
            case "notebook":
                content = await this.prisma.desk.findUnique({
                    where: { id: deskId },
                    select: {
                        notebooks: {
                            where: { id: resourceId ?? "" }
                        }
                    }
                });
                content = content?.notebooks?.[0] ?? null;
                break;
            case "question":
                // content = await this.prisma.desk.findUnique({
                //     where: { id: data.deskId },
                //     select: {
                //         questions: {
                //             where: { id: data.resourceId }
                //         }
                //     }
                // });
                // content = content?.questions?.[0] ?? null;
                break;
            case "chalkboard":
                // content = await this.prisma.desk.findUnique({
                //     where: { id: data.deskId },
                //     select: {
                //         chalkboardMessages: {
                //             where: { id: data.resourceId }
                //         }
                //     }
                // });
                // content = content?.chalkboardMessages?.[0] ?? null;
                // break;
            default:
                throw new Error(`Unsupported resource type: ${data.resourceType}`);
        }
        if(!content) return null
        return new DeskContent({
            id: content.id,
            deskId: content.deskId,
            ownerId: content.ownerId,
            title: content.title,
            description: content.description,
        });
    }
  
   
}