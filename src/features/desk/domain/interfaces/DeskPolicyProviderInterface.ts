import { GetDeskPolicyResult } from "../../application/dto";
import { GetDeskPolicyData } from "../../infrastructure/types";

export interface DeskPolicyProviderInterface {
    getDeskPolicy(data: GetDeskPolicyData): Promise<GetDeskPolicyResult>;
}