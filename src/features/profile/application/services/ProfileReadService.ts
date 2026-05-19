import { ApplicationError } from "@/shared/utils/errors";
import { Result, ok } from "@/shared/application";
import { ProfileReadRepository } from "@/features/profile/domain/repositories";
import { Profile, ProfileForButton, ProfileForDetail, ProfileForPolicy } from "@/features/profile/infrastructure/queries";

export class ProfileReadService {
  constructor(private readonly profileReadRepository: ProfileReadRepository) {}

  async getProfile(userId: string): Promise<Result<Profile | null, ApplicationError>> {
    const profile = await this.profileReadRepository.getProfile(userId);
    return ok(profile);
  }

  async getProfileDetail(userId: string): Promise<Result<ProfileForDetail | null, ApplicationError>> {
    const profile = await this.profileReadRepository.getProfileDetail(userId);
    return ok(profile);
  }

  async getProfileButton(userId: string): Promise<Result<ProfileForButton | null, ApplicationError>> {
    const profile = await this.profileReadRepository.getProfileButton(userId);
    return ok(profile);
  }

  async getProfilePolicy(userId: string): Promise<Result<ProfileForPolicy | null, ApplicationError>> {
    const profile = await this.profileReadRepository.getProfilePolicy(userId);
    return ok(profile);
  }
}
