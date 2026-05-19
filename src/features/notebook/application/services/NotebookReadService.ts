import { ok } from "@/shared/application";
import { Result } from "@/shared/application";
import { ApplicationError } from "@/shared/utils/errors";
import { NotebookReadRepository } from "@/features/notebook/domain/repositories";
import { NotebookForCard, NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { Notebook } from "@/lib/db/prisma";

export class NotebookReadService {
  constructor(private readonly notebookReadRepository: NotebookReadRepository) {}

  async getNotebookById(notebookId: string): Promise<Result<Notebook | null, ApplicationError>> {
    const notebook = await this.notebookReadRepository.getNotebook(notebookId);
    return ok(notebook);
  }

  async getNotebookDetail(notebookId: string): Promise<Result<NotebookForDetail | null, ApplicationError>> {
    const notebook = await this.notebookReadRepository.getNotebookDetail(notebookId);
    return ok(notebook);
  }

  async getNotebookCard(notebookId: string): Promise<Result<NotebookForCard | null, ApplicationError>> {
    const notebook = await this.notebookReadRepository.getNotebookCard(notebookId);
    return ok(notebook);
  }

  async getNotebooks(): Promise<Result<Notebook[], ApplicationError>> {
    const notebooks = await this.notebookReadRepository.getNotebooks();
    return ok(notebooks);
  }

  async getDetailedNotebooks(): Promise<Result<NotebookForDetail[], ApplicationError>> {
    const notebooks = await this.notebookReadRepository.getDetailedNotebooks();
    return ok(notebooks);
  }

  async getNotebookCards(): Promise<Result<NotebookForCard[], ApplicationError>> {
    const notebooks = await this.notebookReadRepository.getNotebookCards();
    return ok(notebooks);
  }

  async getNotebooksByDeskId(deskId: string): Promise<Result<Notebook[], ApplicationError>> {
    const notebooks = await this.notebookReadRepository.getNotebooksByDeskId(deskId);
    return ok(notebooks);
  }

  async getDetailedNotebooksByDeskId(deskId: string): Promise<Result<NotebookForDetail[], ApplicationError>> {
    const notebooks = await this.notebookReadRepository.getDetailedNotebooksByDeskId(deskId);
    return ok(notebooks);
  }

  async getNotebookCardsByDeskId(deskId: string): Promise<Result<NotebookForCard[], ApplicationError>> {
    const notebooks = await this.notebookReadRepository.getNotebookCardsByDeskId(deskId);
    return ok(notebooks);
  }

  async getNotebooksByUserId(userId: string): Promise<Result<Notebook[], ApplicationError>> {
    const notebooks = await this.notebookReadRepository.getNotebooksByUserId(userId);
    return ok(notebooks);
  }

  async getDetailedNotebooksByUserId(userId: string): Promise<Result<NotebookForDetail[], ApplicationError>> {
    const notebooks = await this.notebookReadRepository.getDetailedNotebooksByUserId(userId);
    return ok(notebooks);
  }

  async getNotebookCardsByUserId(userId: string): Promise<Result<NotebookForCard[], ApplicationError>> {
    const notebooks = await this.notebookReadRepository.getNotebookCardsByUserId(userId);
    return ok(notebooks);
  }
}
