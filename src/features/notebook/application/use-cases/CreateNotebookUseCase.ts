import { DeskStorage } from "@/features/desk/domain/services";
import { NotebookRepository } from "../../domain/repositories";
import type { CreateNotebookInput } from "../dto";
import { CreateNotebookResult } from "../dto";
import { ok, Result } from "@/shared/application";

type CreateNotebookUseCaseResult = Result<CreateNotebookResult>
export class CreateNotebookUseCase {
    constructor(private readonly repository: NotebookRepository, private readonly storage: DeskStorage) {}
    async execute(input: CreateNotebookInput): Promise<CreateNotebookUseCaseResult> {
      const { userId, deskId, materials, title, description } = input;
      let uploads: { path: string; url: string }[] = [];
      try {
        // 1. Upload files
        const uploadedMaterials = await Promise.all(
          materials.map(async (m) => {
            const uploaded = await this.storage.uploadFile({
              file: m.file,
              userId,
              deskId,
            });
    
            return {
              type: m.type,
              url: uploaded.url,
              path: uploaded.path,
              fileName: m.file.name,
              title: m.file.name,
              mimeType: m.file.type,
              authorId: userId,
            };
          })
        );
        uploads = uploadedMaterials.map((u) => ({ path: u.path, url: u.url }));
        // 2. Save to DB
        const notebook = await this.repository.create({
          deskId,
          creatorId: userId,
          title: title,
          description: description ?? null,
          materials: uploadedMaterials.map((u) => ({
            type: u.type ?? "OTHER",
            url: u.url,
            path: u.path,
            title: u.title,
            mimeType: u.mimeType,
            authorId: u.authorId,
          })),
        });
    
        return ok({
          notebookId: notebook.id,
          title: notebook.title,
          deskId: notebook.deskId,
          creatorId: notebook.creatorId,
        });
      } catch (error) {
        console.error("Error creating notebook", error);
        try{
          if (uploads.length > 0) {
            await Promise.all(uploads.map(async (m) => {
              await this.storage.remove(m.path);
            }));
          }
        } catch (error) {
          console.error("Error removing uploaded materials", error);
          throw error;
        }
        throw error;

      }
    }
}   