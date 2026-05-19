import { ProfileRepository } from "../../domain/repositories";
import { CheckUsernameResult } from "../dto";
import { ok, Result } from "@/shared/application";
import { InvalidUsernameReason } from "../../domain/value-objects";
type CheckUsernameUseCaseResult = Result<CheckUsernameResult>;
export class CheckUsernameUseCase {
    constructor(private readonly userProfileRepository: ProfileRepository) {}

    async execute(username: string, userId: string): Promise<CheckUsernameUseCaseResult> {
        const profile = await this.userProfileRepository.query.getByUsername(username);
        if(profile && profile.userId !== userId) {
            return ok({ 
                isValid: false, 
                reason: InvalidUsernameReason.ALREADY_EXISTS, 
                message: "Username already exists" 
            });
        }
        return ok({ isValid: true });
        
    }
}