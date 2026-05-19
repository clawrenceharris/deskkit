
import { NotebookRepository } from "../../domain/repositories";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok, Result } from "@/shared/application";
import { VoteNotebookInput } from "../dto";

export class VoteNotebookUseCase {
    constructor(private readonly repository: NotebookRepository) {}
    async execute(input: VoteNotebookInput): Promise<Result<void>> {
        try {
            const { userId, isUpvote, notebookId }  = input;
            if(isUpvote === null){
                await this.repository.removeVote({
                    notebookId,
                    userId,
                });
                return ok(undefined);
            }
            await this.repository.vote({
                notebookId,
                userId,
                isUpvote,
            });
            return ok(undefined);
        } catch (error) {
            const appError = ApplicationError.unexpected(error);
            return fail(appError);
        }
    }
}   