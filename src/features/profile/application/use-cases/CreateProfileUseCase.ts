import { ProfileRepository } from "../../domain/repositories";
import { AvatarStorage } from "../../domain/services";
import { CreateProfileInput, CreateProfileResult } from "../dto";
import { SchoolRepository } from "@/features/school/domain/repositories";
import { DeskRepository } from "@/features/desk/domain/repositories";
import { ok, Result } from "@/shared/application";

export class CreateProfileUseCase {
    constructor(
      private readonly profileRepository: ProfileRepository,
      private readonly storage: AvatarStorage,
      private readonly schoolRepository: SchoolRepository,
      private readonly deskRepository: DeskRepository
    ) {}
  
    async execute(input: CreateProfileInput): Promise<Result<CreateProfileResult>> {
      const { userId, username, displayName, avatarFile , schoolId } = input;
      let uploadedAvatar: { path: string; url: string | null } | null = null;
  
      try {
        // upload avatar
        if (avatarFile) {
          uploadedAvatar = await this.storage.upload({
            userId,
            file: avatarFile,
          });
        }

        // resolve school id
        const normalizedSchoolInput = schoolId?.trim() ?? "";
        let resolvedSchoolId: string | null = null;

        if (normalizedSchoolInput.length > 0) {
          const existingById = await this.schoolRepository.query.getSchool(normalizedSchoolInput);
          if (existingById) {
            resolvedSchoolId = existingById.id;
          } else {
            const existingByName = await this.schoolRepository.query.getSchoolsByName(normalizedSchoolInput);

            if (existingByName[0]) {
              resolvedSchoolId = existingByName[0].id;
            } else {
              const newSchool = await this.schoolRepository.createSchool({
                name: normalizedSchoolInput,
                students: [],
                desks: [],
              });
              resolvedSchoolId = newSchool.id;
            }
          }
        }

        



        // create profile
        const profile = await this.profileRepository.upsert({
          userId: userId,
          username: username,
          schoolId: resolvedSchoolId,
          displayName: displayName ?? null,
          avatarUrl: uploadedAvatar?.url ?? null,
          avatarPath: uploadedAvatar?.path ?? null,
        });

        // join school desk
        if(resolvedSchoolId){
          const schoolDesk = await this.deskRepository.query.getSchoolDesk(resolvedSchoolId);
          if(schoolDesk){
            await this.deskRepository.joinDesk({
              deskId: schoolDesk.id,
              userId: userId,
              role: "CONTRIBUTOR"
            });
          }
        }
        return ok({ 
          userId: profile.userId, 
          username: profile.username, 
          displayName: profile.displayName, 
          schoolId: profile.schoolId 
        });
      } catch (error) {
        console.error("Error creating or updating profile", error);
        if (uploadedAvatar?.path) {
          try {
            await this.storage.remove(uploadedAvatar.path);
          } catch(error) {
            console.error("Error removing avatar", error);
          }
        }
        throw error;
        
      }
  }
}