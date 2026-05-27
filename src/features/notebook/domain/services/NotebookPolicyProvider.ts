import { GetNotebookPolicyResult } from "../../application/dto";
import { NotebookPolicy } from "../entities";
import { GetNotebookPolicyData } from "../../infrastructure/types";

export interface NotebookPolicyProvider {
    getNotebookPolicy(data: GetNotebookPolicyData): Promise<GetNotebookPolicyResult>;
    makeNotebookPolicy(data: GetNotebookPolicyData): Promise<NotebookPolicy>;
}