import { ok, Result } from "@/shared/application";
import { DeskReadRepository } from "@/features/desk/domain/repositories";
import { Desk, DeskForCard, DeskForDetail } from "../../infrastructure/queries";

type GetDeskResult = Result<Desk | null>;
type GetDeskDetailResult = Result<DeskForDetail | null>;
type GetDeskCardResult = Result<DeskForCard | null>;
type GetDesksResult = Result<Desk[]>;
type GetDeskDetailsResult = Result<DeskForDetail[]>;
type GetDeskCardsResult = Result<DeskForCard[]>;

export class DeskReadService {
    async getJoinedDesks(userId: string) {
        const joinedDesks = await this.deskReadRepository.getJoinedDesks(userId);
        return ok(joinedDesks);
    }
    async getJoinedDesksDetail(userId: string) {
        const joinedDesks = await this.deskReadRepository.getJoinedDesksDetail(userId);
        return ok(joinedDesks);
    }
    async getJoinedDesksCard(userId: string) {
        const joinedDesks = await this.deskReadRepository.getJoinedDesksCard(userId);
        return ok(joinedDesks);
    }
   
    constructor(private readonly deskReadRepository: DeskReadRepository) {}

    // Desk Single Queries
    async getDeskById(deskId: string): Promise<GetDeskResult> {
        const desk = await this.deskReadRepository.getDesk(deskId);
        return ok(desk);
    }
    async getDeskDetail(deskId: string): Promise<GetDeskDetailResult> {
        const desk = await this.deskReadRepository.getDeskDetail(deskId);
        return ok(desk);
    }
    async getDeskCard(deskId: string): Promise<GetDeskCardResult> {
        const desk = await this.deskReadRepository.getDeskCard(deskId);
        return ok(desk);
    }

   
   
    // Desk List Queries
    async getDesks(): Promise<GetDesksResult> {
        const desks = await this.deskReadRepository.getDesks();
        return ok(desks);
    }
    async getDesksDetail(): Promise<GetDeskDetailsResult> {
        const desks = await this.deskReadRepository.getDesksDetail();
        return ok(desks);
    }

    async getDeskCards(): Promise<GetDeskCardsResult> {
        const desks = await this.deskReadRepository.getDesksCard();
        return ok(desks);
    }

    // Desks By School Queries
    async getDesksBySchoolId(schoolId: string): Promise<GetDesksResult> {   
        const desks = await this.deskReadRepository.getDesksBySchool(schoolId);
        return ok(desks);
    }
    async getDesksDetailBySchoolId(schoolId: string): Promise<GetDeskDetailsResult> {
        const desks = await this.deskReadRepository.getDesksDetailBySchool(schoolId);
        return ok(desks);
    }
    async getDeskCardsBySchoolId(schoolId: string): Promise<GetDeskCardsResult> {
        const desks = await this.deskReadRepository.getDesksCardBySchool(schoolId);
        return ok(desks);
    }

    // Desks By Creator Queries

    async getDeskCardsByCreatorId(userId: string): Promise<GetDeskCardsResult> {
        const desks = await this.deskReadRepository.getDesksCardByCreator(userId);
        return ok(desks);
    }
  
    async getDesksByCreatorId(userId: string): Promise<GetDesksResult> {
        const desks = await this.deskReadRepository.getDesksByCreator(userId);
        return ok(desks);
    }
    async getDesksDetailByCreator(userId: string): Promise<GetDeskDetailsResult> {
        const desks = await this.deskReadRepository.getDesksDetailByCreator(userId);
        return ok(desks);
    }


    // My Desk Queries
    async getMyDesk(userId: string): Promise<GetDeskResult> {
        const myDesk = await this.deskReadRepository.getMyDesk(userId);
        return ok(myDesk);
    }
    async getMyDeskDetail(userId: string): Promise<GetDeskDetailResult> {
        const myDesk = await this.deskReadRepository.getMyDeskDetail(userId);
        return ok(myDesk);
    }
    async getMyDeskCard(userId: string): Promise<GetDeskCardResult> {
        const myDesk = await this.deskReadRepository.getMyDeskCard(userId);
        return ok(myDesk);
    }
   

    // School Desk Queries
    async getSchoolDesk(schoolId: string): Promise<GetDeskResult> {
        const schoolDesk = await this.deskReadRepository.getSchoolDesk(schoolId);
        return ok(schoolDesk);
    }

    async getSchoolDeskDetail(schoolId: string): Promise<GetDeskDetailResult> {
        const schoolDesk = await this.deskReadRepository.getDetailedSchoolDesk(schoolId);
        return ok(schoolDesk);
    }
    async getSchoolDeskCard(schoolId: string): Promise<GetDeskCardResult> {
        const schoolDesk = await this.deskReadRepository.getSchoolDeskCard(schoolId);
        return ok(schoolDesk);
    }
}