import { NotebookRepository } from "../../domain/repositories";
import { UpdateNotebookInput, UpdateNotebookResult } from "../dto";
import { DeskStorage } from "@/features/desk/domain/services";
import { ApplicationError } from "@/shared/utils/errors";
import { fail, ok, Result } from "@/shared/application";
import { AppErrorCode } from "@/types/errors";

type UpdateNotebookUseCaseResult = Result<UpdateNotebookResult>;
export class UpdateNotebookUseCase {
    constructor(
        private readonly repository: NotebookRepository,
        private readonly storage: DeskStorage
    ) {}
    async execute(input: UpdateNotebookInput): Promise<UpdateNotebookUseCaseResult> {
        const { notebookId, removeMaterialIds, title, description, materials } = input;
        const uploadedPaths: string[] = [];
        
        try {
            const existingNotebook = await this.repository.query.getNotebookDetail(notebookId);
            if (!existingNotebook) {
                const appError = new ApplicationError({code: AppErrorCode.RESOURCE_NOT_FOUND, message: "Notebook not found"});
                return fail(appError);
            }

            const existingMaterials = existingNotebook.materials;
            const existingMaterialIds = new Set(existingMaterials.map((material) => material.id));
            const explicitRemoveIds = new Set(
                (removeMaterialIds ?? []).filter((id) => existingMaterialIds.has(id))
            );
            const keepMaterialIds = input.keepMaterialIds
                ? new Set(input.keepMaterialIds.filter((id) => existingMaterialIds.has(id)))
                : null;
            const materialIdsToDelete = new Set<string>();
            if (keepMaterialIds) {
                for (const material of existingMaterials) {
                    if (!keepMaterialIds.has(material.id)) {
                        materialIdsToDelete.add(material.id);
                    }
                }
            }
            for (const id of explicitRemoveIds) {
                materialIdsToDelete.add(id);
            }

            const uploadedMaterials = await Promise.all(
                (materials ?? []).map(async (material) => {
                    const uploaded = await this.storage.uploadFile({
                        file: material.file,
                        userId: existingNotebook.creatorId,
                        deskId: existingNotebook.deskId,
                    });
                    uploadedPaths.push(uploaded.path);
                    return {
                        type: material.type ?? "OTHER",
                        url: uploaded.url,
                        path: uploaded.path,
                        title: material.file.name,
                        mimeType: material.file.type,
                        authorId: existingNotebook.creatorId,
                    };
                })
            );

            const updated = await this.repository.update({
                notebookId,
                title,
                description,
                materialsToCreate: uploadedMaterials.length > 0 ? uploadedMaterials : undefined,
                materialIdsToDelete: materialIdsToDelete.size > 0 ? Array.from(materialIdsToDelete) : undefined,
            });

            const pathsToDelete = existingMaterials
                .filter((material) => materialIdsToDelete.has(material.id))
                .map((material) => material.path);
            if (pathsToDelete.length > 0) {
                await Promise.allSettled(pathsToDelete.map((path) => this.storage.remove(path)));
            }
            return ok({
                notebookId: updated.id, 
                title: updated.title, 
                deskId: updated.deskId, 
                creatorId: updated.creatorId
            });
        } catch (error) {
            if (uploadedPaths.length > 0) {
                await Promise.allSettled(uploadedPaths.map((path) => this.storage.remove(path)));
            }
            console.error("Error updating notebook", error);
            throw error;
        }
    }
}