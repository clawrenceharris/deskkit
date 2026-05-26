import { ok, Result } from "@/shared/application";
import { DeskRepository } from "../../domain/repositories";
import { DeskStorage } from "../../domain/services";
import { UpdateDeskInput, UpdateDeskResult } from "../dto";
import { ApplicationError } from "@/shared/utils/errors";
import { DeskVisibility } from "../../domain/value-objects";

 type UpdateDeskUseCaseResult = Result<UpdateDeskResult, ApplicationError>;
export class UpdateDeskUseCase { 
    constructor(private readonly deskRepository: DeskRepository, private readonly storage: DeskStorage) {}

    async execute(input: UpdateDeskInput): Promise<UpdateDeskUseCaseResult> {
        const {deskId,  name, schoolId, imageFile, visibility, description } = input;
    let uploadedImage: { path: string; url: string | null } | null = null;
  
      try {
        const desk = await this.deskRepository.updateDesk({
          deskId,
          name,
          schoolId,
          imageUrl:  null,
          imagePath: null,
          visibility: visibility ?? DeskVisibility.SCHOOL,
          description: description ?? null,
        });
        if (imageFile) {
          uploadedImage = await this.storage.uploadImage({
            deskId: desk.id,
            file: imageFile,
          });
        }
        await this.deskRepository.updateDesk({
          deskId: desk.id,
          imageUrl: uploadedImage?.url ?? null,
          imagePath: uploadedImage?.path ?? null,
            
        });
        return ok({ deskId: desk.id, creatorId: desk.creatorId, deskName: desk.name });
        
      } catch (error) {
        if (uploadedImage?.path) {
          try {
            await this.storage.remove(uploadedImage.path);
          } catch(error) {
            console.error("Error removing image", error);
          }
        }
        throw error;
        
      }
    }
}   