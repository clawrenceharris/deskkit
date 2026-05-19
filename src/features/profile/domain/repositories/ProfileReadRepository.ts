import { Profile, ProfileForButton, ProfileForDetail, ProfileForPolicy } from "../../infrastructure/queries";

export interface ProfileReadRepository {
  getByUsername(username: string): Promise<Profile | null>;
  getProfile(userId: string): Promise<Profile | null>;
  getProfileDetail(userId: string): Promise<ProfileForDetail | null>;
  getProfileButton(userId: string): Promise<ProfileForButton | null>;
  getProfilePolicy(userId: string): Promise<ProfileForPolicy | null>;
}
