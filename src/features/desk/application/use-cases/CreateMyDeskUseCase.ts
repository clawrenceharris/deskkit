import { ApplicationError } from "@/shared/utils/errors";
import { ProfileRepository } from "@/features/profile/domain/repositories";
import { fail, ok, Result } from "@/shared/application";
import { AppErrorCode } from "@/types/errors";
import { CreateDeskResult } from "../dto";
import { DeskRepository } from "../../domain/repositories";

export type CreateMyDeskUseCaseResult = Result<CreateDeskResult>;
export class CreateMyDeskUseCase {
    constructor(private readonly deskRepository: DeskRepository, private readonly profileRepository: ProfileRepository) {}

    async execute(userId: string): Promise<CreateMyDeskUseCaseResult> {
        const profile = await this.profileRepository.query.getProfile(userId);
        if(!profile){
            return fail(new ApplicationError({code: AppErrorCode.RESOURCE_NOT_FOUND, message: "Profile not found"}));
        }
        const myDesk = await this.deskRepository.createMyDesk(userId);
        return ok({deskId: myDesk.id, creatorId: userId, deskName: myDesk.name });
        
    }
}