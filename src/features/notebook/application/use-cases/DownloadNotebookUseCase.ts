import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok, Result } from "@/shared/application";
import { NotebookRepository } from "../../domain/repositories";
import { DownloadNotebookInput } from "../dto/download-notebook/DownloadNotebookInput";
import { AppErrorCode } from "@/types";


export class DownloadNotebookUseCase {
    constructor(private readonly repository: NotebookRepository) {}
    async execute(input: DownloadNotebookInput): Promise<Result<void>> {
        const notebook = await this.repository.query.getNotebookDetail(input.notebookId);
        if(!notebook) {
            return fail(new ApplicationError({code: AppErrorCode.RESOURCE_NOT_FOUND, message: "Notebook not found"}));
        }
        // If the notebook is already downloaded by the user, return ok without doing anything
        if(notebook.downloads.some((download) => download.profile?.userId === input.userId)) {
            return ok(undefined);
        }
        await this.repository.downloadNotebook(input);
        return ok(undefined);
    }
}