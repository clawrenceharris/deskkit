import { DownloadNotebookInput } from "../../application/dto";
import { NotebookForDetail, NotebookVote } from "../../infrastructure/queries";
import { CreateNotebookData, RemoveVoteData, UpdateNotebookData, VoteNotebookData } from "../../infrastructure/repositories/types";
import { NotebookReadRepository } from "./";

export interface NotebookRepository {
    query: NotebookReadRepository;
    create(data: CreateNotebookData): Promise<NotebookForDetail>;
    delete(id: string): Promise<NotebookForDetail>;
    vote(data: VoteNotebookData): Promise<void>;
    removeVote(data: RemoveVoteData): Promise<void>;
    getVotesByNotebookId(notebookId: string): Promise<NotebookVote[]>;
    downloadNotebook(input: DownloadNotebookInput): Promise<void>;
    update(data: UpdateNotebookData): Promise<NotebookForDetail>;
}
