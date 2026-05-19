
import { NotebookRepository } from "../../domain/repositories";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok, Result } from "@/shared/application";
import { DeleteNotebookResult } from "../dto";

type DeleteNotebookUseCaseResult = Result<DeleteNotebookResult>;
export class DeleteNotebookUseCase {
    constructor(private readonly repository: NotebookRepository) {}
    async execute(id: string): Promise<DeleteNotebookUseCaseResult> {
        try {
            const deleted =await this.repository.delete(id);
            return ok({
                notebookId: deleted.id,
                name: deleted.title,
                creatorId: deleted.creatorId,
                deskId: deleted.deskId,
            });
        } catch (error) {
            console.error("Error deleting notebook", error);
            return fail(ApplicationError.unexpected(error));
        }
    }
}