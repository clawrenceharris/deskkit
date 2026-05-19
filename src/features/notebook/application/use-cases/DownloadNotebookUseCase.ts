import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok, Result } from "@/shared/application";
import { NotebookRepository } from "../../domain/repositories";
import { DownloadNotebookInput } from "../dto/download-notebook/DownloadNotebookInput";


export class DownloadNotebookUseCase {
    constructor(private readonly repository: NotebookRepository) {}
    async execute(input: DownloadNotebookInput): Promise<Result<void>> {
        try {
            await this.repository.downloadNotebook(input);
            return ok(undefined);
        } catch (error) {
            console.error("Error downloading notebook", error);
            return fail(ApplicationError.unexpected(error));
        }
    }
}