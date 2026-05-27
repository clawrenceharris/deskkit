import { AppErrorCode } from "@/types";
import { NotebookPolicy } from "../../domain/entities";
import { NotebookRepository } from "../../domain/repositories";
import { NotebookPolicyProvider } from "../../domain/services";
import { GetNotebookPolicyData } from "../types";
import { ApplicationError } from "@/shared/utils/errors";
import { GetNotebookPolicyResult } from "../../application/dto";
export class PrismaNotebookPolicyProvider implements NotebookPolicyProvider {
    constructor(private readonly notebookRepository: NotebookRepository) {}
    async makeNotebookPolicy(data: GetNotebookPolicyData): Promise<NotebookPolicy> {
        const notebook = await this.notebookRepository.query.getNotebookDetail(data.notebookId);
        if(!notebook){
            throw new ApplicationError({code: AppErrorCode.RESOURCE_NOT_FOUND, message: "Notebook not found"});
        }
        return new NotebookPolicy(notebook);
    }

    async getNotebookPolicy(data: GetNotebookPolicyData): Promise<GetNotebookPolicyResult> {
       const policy = await this.makeNotebookPolicy(data);
        return {
            canPreview: policy.canPreview(),
            canView: policy.canView(),
            canDelete: policy.canDelete(),
            canDownload: policy.canDownload(),
            canUpdate: policy.canUpdate(),
        };
    }
}