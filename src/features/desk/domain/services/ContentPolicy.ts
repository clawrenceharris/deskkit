import { DeskContent } from "../entities";

export interface ContentPolicy{
    canCreateContent(userId:string): boolean;
    canEditContent(userId:string, content: DeskContent): boolean;
    canDeleteContent(userId:string, contentId: DeskContent): boolean;
    canUpdateContent(userId:string, content: DeskContent): boolean;
}