import { ok, Result } from "@/shared/application";
import { DeskRepository } from "../../domain/repositories";
import { JoinOrLeaveDeskInput } from "../dto";

type JoinDeskUseCaseResult = Result<void>;
export class JoinDeskUseCase {
    constructor(private readonly deskRepository: DeskRepository) {}

    async execute(input: JoinOrLeaveDeskInput): Promise<JoinDeskUseCaseResult> {
        await this.deskRepository.join(input);
        return ok(undefined);
    }
}