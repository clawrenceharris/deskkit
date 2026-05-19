import { ApplicationError } from "@/shared/utils/errors";
import { SchoolRepository } from "@/features/school/domain/repositories";
import { fail, ok, Result } from "@/shared/application";
import { AppErrorCode } from "@/types/errors";
import { CreateDeskResult } from "../dto";
import { DeskRepository } from "@/features/desk/domain/repositories";

export type CreateSchoolDeskUseCaseResult = Result<CreateDeskResult>;
export class CreateSchoolDeskUseCase {
    constructor(private readonly deskRepository: DeskRepository, private readonly schoolRepository: SchoolRepository) {}

    async execute(schoolId: string): Promise<CreateSchoolDeskUseCaseResult> {
        const school = await this.schoolRepository.query.getSchool(schoolId);
        if(!school){
            return fail(new ApplicationError({code: AppErrorCode.RESOURCE_NOT_FOUND, message: "School not found"}));
        }
        const desk = await this.deskRepository.createSchoolDesk({schoolId, schoolName: school.name});
        return ok({ deskId: desk.id, creatorId: desk.creatorId, deskName: desk.name });
    }
}