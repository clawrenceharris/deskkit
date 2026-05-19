
import { SchoolForPolicy } from "@/features/school/infrastructure/queries";
import { DeskPolicyService } from ".";
import { DeskForDetail } from "../../infrastructure/queries";
import { ProfileForPolicy } from "@/features/profile/infrastructure/queries";
import { MemberRole } from "@/lib/db/prisma";

export class SchoolDeskPolicy extends DeskPolicyService {
    constructor(
        role: MemberRole | null, 
        desk: DeskForDetail, 
        user: ProfileForPolicy | null, 
        school: SchoolForPolicy | null
        ) {
        super(role, desk, user, school);
    }
     /**
     * @remark A user can preview the school desk if they are a member of the school
     */
     canPreview(): boolean {
        const { role, user, school } = this;
        if(!role || !user || !school) return false;

        return this.desk.id === school.schoolDesk?.deskId && 
        this.desk.members.some(member => member.profile.userId === user.userId);
    }

    /**
     * @remark A user can view the school desk if they are a member of the school
     */
    canView(): boolean {
        const { role, desk, user, school } = this;
        if(!role || !desk || !user || !school) return false;

        return super.canView() && 
        desk.id === school.schoolDesk?.deskId && 
        user.schoolId === school.id
        
    }
    /**
     * @remark A user can post to the school desk if they are a member of the school and they are a member of the school
     */
    canPost(): boolean {
        const { role, desk, user, school } = this;
        if(!role || !desk || !user || !school) return false;

        return  super.canPost() && 
        desk.id === school.schoolDeskId &&
        user.schoolId === school.id
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
        const { role, desk, user, school } = this;
        if(!role || !desk || !user || !school) return false;

        return super.canJoin() && 
        desk.id === school.schoolDeskId &&
        user.schoolId === school.id
    }

}   