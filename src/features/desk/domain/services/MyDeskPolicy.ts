import { DeskPolicyService } from ".";
import { ProfileForPolicy } from "@/features/profile/infrastructure/queries";
import { SchoolForPolicy } from "@/features/school/infrastructure/queries";
import { MemberRole } from "@/lib/db/prisma";
import { DeskForDetail } from "../../infrastructure/queries";

export class MyDeskPolicy extends DeskPolicyService {
    constructor(
        role: MemberRole | null, 
        desk: DeskForDetail, 
        user: ProfileForPolicy | null, 
        school: SchoolForPolicy | null
        ) {
        super(role, desk, user, school);
    }
    /**
     * @remark A user can preview their own desk if it belongs to them
     */
    canPreview(): boolean {
        const { user } = this;
        if(!user) return false;

        return this.desk.id === user.myDesk?.deskId;
    }

    /**
     * @remark A user can view their own desk if it belongs to them
     */
    canView(): boolean {
        const { user } = this;
        if(!user) return false;

        return this.desk.id === user.myDesk?.deskId;
    }
    /**
     * @remark A user can contribute to their own desk if it belongs to them
     */
    canContribute(): boolean {
        const { user } = this;
        if(!user) return false;

        return this.desk.id === user.myDesk?.deskId;
    }
    /**
     * @remark A user can delete their own desk if it belongs to them
     */
    canDelete(): boolean {
        return false;
    }
    /**
     * @remark A user can update their own desk if it belongs to them
    
     */
    canUpdate(): boolean {
        const { user } = this;
        if(!user) return false;
        return this.desk.id === user.myDesk?.deskId;
    }

    /**
     * @remark A user can join 'my desk' only if it belongs to them
     */
    canJoin(): boolean {
        const { user } = this;
        if(!user) return false;
        return this.desk.id === user.myDesk?.deskId;
    }
}