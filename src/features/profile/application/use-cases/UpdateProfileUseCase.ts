import { ProfileRepository } from "../../domain/repositories";
import { AvatarStorage } from "../../domain/services";
import { ApplicationError } from "@/shared/utils/errors";
import { UpdateProfileInput } from "../dto";
import { SchoolRepository } from "@/features/school/domain/repositories";
import { Profile } from "@/lib/db/prisma";
import { fail, ok, Result } from "@/shared/application";
import { UpdateProfileResult } from "../dto";
import { AppErrorCode } from "@/types/errors";

export class UpdateProfileUseCase {
    constructor(
      private readonly profileRepository: ProfileRepository,
      private readonly storage: AvatarStorage,
      private readonly schoolRepository: SchoolRepository
    ) {}
  
    async execute(input: UpdateProfileInput): Promise<Result<UpdateProfileResult>> {
      const { userId, username, displayName, avatarFile, schoolId  } = input;
      let uploadedAvatar: { path: string; url: string | null } | null = null;

      try {
        
        if(username){
          const existingProfile = await this.profileRepository.query.getByUsername(username);
          if(existingProfile && existingProfile.userId !== userId){
            return fail(new ApplicationError({ code: AppErrorCode.USERNAME_ALREADY_EXISTS }));
          }
        }
        
        if (avatarFile) {
          uploadedAvatar = await this.storage.upload({
            userId,
            file: avatarFile,
          });
        }
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
        const data: Partial<Profile> = {
          userId,
          username: username ?? "",
          displayName: displayName ?? null,
          schoolId: resolvedSchoolId ?? null,
        }
        if(uploadedAvatar){
          data.avatarUrl = uploadedAvatar.url;
          data.avatarPath = uploadedAvatar.path;
        }
        const profile = await this.profileRepository.update(data);
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