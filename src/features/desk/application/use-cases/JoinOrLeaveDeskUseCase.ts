import { fail, ok, Result } from "@/shared/application";
import { DeskRepository } from "../../domain/repositories";
import { JoinOrLeaveDeskInput } from "../dto";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types/errors";

type JoinOrLeaveDeskUseCaseResult = Result<void>;
export class JoinOrLeaveDeskUseCase {
    constructor(private readonly deskRepository: DeskRepository) {}

    async execute(input: JoinOrLeaveDeskInput): Promise<JoinOrLeaveDeskUseCaseResult> {
        if(input.isJoining){
            const desk = await this.deskRepository.query.getDeskDetail(input.deskId);
            if(!desk){
                return fail(new ApplicationError({code: AppErrorCode.RESOURCE_NOT_FOUND, message: "Desk not found"}));
            }
            if(desk.members.some(member => member.profile.userId === input.userId)){
                return fail(new ApplicationError({code: AppErrorCode.DATABASE_CONFLICT, message: "You are already a member of this desk"}));
            }
           
            await this.deskRepository.join(input);
        } else {
            const desk = await this.deskRepository.query.getDeskDetail(input.deskId);
            if(!desk){
                return fail(new ApplicationError({code: AppErrorCode.RESOURCE_NOT_FOUND, message: "Desk not found"}));
            }
            if(!desk.members.some(member => member.profile.userId === input.userId)){
                return fail(new ApplicationError({code: AppErrorCode.RESOURCE_NOT_FOUND, message: "You are not a member of this desk"}));
            }
            await this.deskRepository.leave(input);
        }
        return ok(undefined);
    }
}