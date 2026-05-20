import { ProfileForPolicy } from "@/features/profile/infrastructure/queries";
import { DeskForDetail } from "../../infrastructure/queries";
import { MemberRole } from "@/lib/db/prisma";
import { SchoolForPolicy } from "@/features/school/infrastructure/queries";
import { DeskPolicy } from "./";

export class DeskPolicyService implements DeskPolicy {
    constructor(
        protected readonly role: MemberRole | null, 
        protected readonly desk: DeskForDetail,
        protected readonly user: ProfileForPolicy | null,
        protected readonly school: SchoolForPolicy | null,
        ) {}
    /**
     * @remark A user can preview a desk or a desk content only if the desk is public
    */
    canPreview(): boolean {
        if(!this.desk) return false;
        return this.desk.isPublic;
    }
    /**
     * @remark A user can view a desk if they are a member of the desk
     */
    canView(): boolean {
        const { role, user, desk } = this;
        if(!role || !user || !desk) return false;
        return desk.members.some(member => member.profile.userId === user.userId) || desk.creatorId === user.userId;
    }
    /**
     * @remark A user can post new resources to the desk if they are a member of the desk
    */
    canPost(): boolean {
        const { role } = this;
        if(!role) return false;

        return role === MemberRole.OWNER || role === MemberRole.CONTRIBUTOR;
    }
    /**
     * @remark A user can delete resources from the desk if they are the creator of the desk
     */
    canDelete(): boolean {
        const { role, user } = this;
        if(!role || !user) return false;

        return this.desk.members.some(member => member.profile.userId === user.userId && member.role === MemberRole.OWNER)
        || user.userId === this.desk.creatorId;
    }
    /**
     * @remark A user can update desk resources if they are the creator of the desk
     */
    canUpdate(): boolean {
        const { role, user } = this;
        if(!role || !user) return false;

        return this.desk.members.some(member => member.profile.userId === user.userId && member.role === MemberRole.OWNER)
        || user.userId === this.desk.creatorId;
    }

   
    /**
     * @remark A user can join a desk if the desk is public
     */
    canJoin(): boolean {
        if(!this.desk) return false;
        return this.desk.isPublic;
    }



}