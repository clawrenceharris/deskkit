import { Desk, DeskForCard, DeskForDetail } from "../../infrastructure/queries";

export interface DeskReadRepository {
    getDeskDetail(deskId: string): Promise<DeskForDetail | null>;

  
    getMyDeskDetail(userId: string): Promise<   DeskForDetail | null>;
    getDetailedSchoolDesk(schoolId: string): Promise<DeskForDetail | null>;
    
    getDesksDetail(): Promise<DeskForDetail[]>;
    getDesksDetailByCreator(userId: string): Promise<DeskForDetail[]>;
    getDesksDetailBySchool(schoolId: string): Promise<DeskForDetail[]>;
    getJoinedDesksDetail(userId: string): Promise<DeskForDetail[]>;


    getDeskCard(deskId: string): Promise<DeskForCard | null>;
    
  
    getMyDeskCard(userId: string): Promise<DeskForCard | null>;
    getSchoolDeskCard(schoolId: string): Promise<DeskForCard | null>;

    getDesksCard(): Promise<DeskForCard[]>;
    getDesksCardByCreator(userId: string): Promise<DeskForCard[]>;
    getDesksCardBySchool(schoolId: string): Promise<DeskForCard[]>;
    getJoinedDesksCard(userId: string): Promise<DeskForCard[]>;
    
    getDeskCard(deskId: string): Promise<DeskForCard | null>;

    getMyDeskCard(userId: string): Promise<DeskForCard | null>;
    getSchoolDeskCard(schoolId: string): Promise<DeskForCard | null>;

    
    getDesk(deskId: string): Promise<Desk | null>;
    
    getMyDesk(userId: string): Promise<Desk | null>;
    getSchoolDesk(schoolId: string): Promise<Desk | null>;

   
    getDesks(): Promise<Desk[]>;
    getJoinedDesks(userId: string): Promise<Desk[]>;

    getDesksByCreator(userId: string): Promise<Desk[]>;
    
    getDesksBySchool(schoolId: string): Promise<Desk[]>;
    
}