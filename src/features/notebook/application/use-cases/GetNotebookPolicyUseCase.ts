import { NotebookPolicyProvider } from "../../domain/services";
import { GetNotebookPolicyInput, GetNotebookPolicyResult } from "../dto";
import { Result } from "@/shared/application";

export class GetNotebookPolicyUseCase {
    constructor(private readonly notebookPolicyProvider: NotebookPolicyProvider) {}

    async execute(input: GetNotebookPolicyInput): Promise<Result<GetNotebookPolicyResult>> {
        const { notebookId, userId, deskId } = input;
        if(!notebookId || !userId || !deskId){
            console.error("Missing required fields", { notebookId, userId });
            return { 
                success: true, 
                data: {
                    canView: false,
                    canDelete: false,
                    canUpdate: false,
                    canPreview: false,
                    canDownload: false, 
                }
            };
        }
        const policy = await this.notebookPolicyProvider.getNotebookPolicy({
            notebookId,
            userId,
            deskId,
        });
        return { success: true, data: policy };
    
    }
}