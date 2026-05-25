import { DeskPolicyProvider } from "../../infrastructure/providers";
import { GetDeskPolicyInput, GetDeskPolicyResult } from "../dto";
import { Result } from "@/shared/application";

export class GetDeskPolicyUseCase {
    constructor(private readonly deskPolicyProvider: DeskPolicyProvider) {}

    async execute(input: GetDeskPolicyInput): Promise<Result<GetDeskPolicyResult>> {
        const { deskId, userId } = input;
        if(!deskId || !userId){
            console.error("Missing required fields", { deskId, userId });
            return { 
                success: true, 
                data: {
                    canView: false,
                    canDelete: false,
                    canUpdate: false,
                    canPreview: false,
                    canPost: false, 
                    canJoin: false,
                }
            };
        }
        const policy = await this.deskPolicyProvider.getDeskPolicy({
            ...input,
            userId,
            deskId, 
            deskType: input.deskType ?? null,
            resourceId: input.resourceId ?? null, 
            resourceType: input.resourceType ?? null,
        });
        return { success: true, data: policy };
    
    }
}