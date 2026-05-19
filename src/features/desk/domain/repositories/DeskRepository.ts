import type { CreateSchoolDeskInput, JoinOrLeaveDeskInput } from "../../application/dto";
import type { DeskForDetail } from "../../infrastructure/queries";
import { CreateDeskData, UpdateDeskData } from "../../infrastructure/types";
import { Desk } from "@/lib/db/prisma";
import { DeskReadRepository } from "./DeskReadRepository";

export interface DeskRepository {
  query: DeskReadRepository;
  create(input: CreateDeskData): Promise<Desk>;
  update(input: UpdateDeskData): Promise<Desk>;
  delete(id: string): Promise<void>;
  join(input: JoinOrLeaveDeskInput): Promise<void>;
  leave(input: JoinOrLeaveDeskInput): Promise<void>;
  createSchoolDesk(input: CreateSchoolDeskInput): Promise<DeskForDetail>;
  createMyDesk(userId: string): Promise<DeskForDetail>;
}