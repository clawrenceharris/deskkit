import { ProfileForDetail } from "../../infrastructure/queries";
import { CreateOrUpdateProfileData } from "../../infrastructure/repositories/types/CreateOrUpdateProfileData";
import { ProfileReadRepository } from "./ProfileReadRepository";
export interface ProfileRepository {
    query: ProfileReadRepository;
    upsert(data: CreateOrUpdateProfileData): Promise<ProfileForDetail>;
    existsByUsername(username: string): Promise<boolean>;
    create(data: CreateOrUpdateProfileData): Promise<ProfileForDetail>
    update(data: Partial<CreateOrUpdateProfileData>): Promise<ProfileForDetail>
    delete(id: string): Promise<void>
    existsByUserId(userId: string): Promise<boolean>
}