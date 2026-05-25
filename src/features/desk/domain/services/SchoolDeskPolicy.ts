
import { DeskPolicyService } from ".";
import { DeskForDetail } from "../../infrastructure/queries";
import { ProfileForPolicy } from "@/features/profile/infrastructure/queries";
import { MemberRole } from "@/lib/db/prisma";

export class SchoolDeskPolicy extends DeskPolicyService {
    constructor(
        role: MemberRole | null, 
        desk: DeskForDetail, 
        user: ProfileForPolicy | null, 
        ) {
        super(role, desk, user);
    }
     /**
     * @remark A user can preview the school desk if they are a member of the school
     */
     canPreview(): boolean {
        const { role, user } = this;
        if(!role || !user ) return false;

        return super.canPreview() && this.desk.members.some(member => member.profile.userId === user.userId);
    }

    /**
     * @remark A user can view the school desk if they are a member of the school
     */
    canView(): boolean {
        const { role, desk, user } = this;
        if(!role || !desk || !user ) return false;

        return super.canView() && 
        user.schoolId === desk.schoolId
        
    }
    /**
     * @remark A user can post to the school desk if they are a member of the school and they are a member of the school
     */
    canPost(): boolean {
        const { role, desk, user } = this;
        if(!role || !desk || !user ) return false;

        return  super.canPost() && 
        user.schoolId === desk.schoolId
    }
    /**
     * @remark A user can never delete the school desk
    */
    canDelete(): boolean {
        return false
    }
    /**
     * @remark A user can never update the school desk
    
     */
    canUpdate(): boolean {
        return false
    }

    canJoin(): boolean {
        const { role, desk, user } = this;
        if(!role || !desk || !user ) return false;

        return super.canJoin() && 
        user.schoolId === desk.schoolId
    }

}   