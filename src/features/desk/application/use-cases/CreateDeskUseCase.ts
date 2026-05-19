import { DeskRepository } from "../../domain/repositories";
import { DeskStorage } from "../../domain/services";
import { CreateDeskInput,CreateDeskResult } from "../dto";
import {  ok, Result } from "@/shared/application";

export type CreateDeskUseCaseResult = Result<CreateDeskResult>;
export class CreateDeskUseCase {
  constructor(private readonly deskRepository: DeskRepository, private readonly storage: DeskStorage) {}

  async execute(input: CreateDeskInput): Promise<CreateDeskUseCaseResult> {
    const { name, schoolId, imageFile, isPublic, creatorId } = input;
    let uploadedImage: { path: string; url: string | null } | null = null;
  
      try {
        
        const desk = await this.deskRepository.create({
          creatorId,
          name,
          schoolId,
          imageUrl:  null,
          imagePath: null,
          isPublic: isPublic ?? true,
          description: null,
        });
        if (imageFile) {
          uploadedImage = await this.storage.uploadImage({
            deskId: desk.id,
            file: imageFile,
          });
        }
        await this.deskRepository.update({
          deskId: desk.id, 
          imageUrl: uploadedImage?.url ?? null,
          imagePath: uploadedImage?.path ?? null,
          
        });
        return ok({ deskId: desk.id, creatorId, deskName: desk.name });
        
      } catch (error) {
        if (uploadedImage?.path) {
          try {
            await this.storage.remove(uploadedImage.path);
          } catch(error) {
            console.error("Error removing avatar", error);
          }
        }
        throw error;
        
      }
  }
}   