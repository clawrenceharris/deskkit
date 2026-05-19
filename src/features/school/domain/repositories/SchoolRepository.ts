import { CreateSchoolInput, UpdateSchoolInput } from "../../application/dto";
import { SchoolForDetail } from "../../infrastructure/queries";
import { SchoolReadRepository } from "./SchoolReadRepository";

export interface SchoolRepository  {
    query: SchoolReadRepository;
    createSchool(input: CreateSchoolInput): Promise<SchoolForDetail>;
    updateSchool(input: UpdateSchoolInput): Promise<SchoolForDetail>;
    deleteSchool(id: string): Promise<void>;
    
}