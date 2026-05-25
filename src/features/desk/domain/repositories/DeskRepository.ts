import type { CreateSchoolDeskInput, JoinOrLeaveDeskInput } from "../../application/dto";
import type { Desk, DeskForDetail } from "../../infrastructure/queries";
import { CreateDeskData, UpdateDeskData } from "../../infrastructure/types";
import { DeskReadRepository } from "./DeskReadRepository";

export interface DeskRepository {
  query: DeskReadRepository;
  createDesk(input: CreateDeskData): Promise<Desk>;
  updateDesk(input: UpdateDeskData): Promise<Desk>;
  deleteDesk(id: string): Promise<Desk>;
  joinDesk(input: JoinOrLeaveDeskInput): Promise<void>;
  leaveDesk(input: JoinOrLeaveDeskInput): Promise<void>;
  createSchoolDesk(input: CreateSchoolDeskInput): Promise<DeskForDetail>;
  createMyDesk(userId: string): Promise<DeskForDetail>;
}