"use server";
import { makeCreateMyDeskUseCase } from "@/composition/desk";
import { normalizeError } from "@/shared/utils/errors";
import { ActionResult } from "@/shared/action";
import { CreateDeskResult } from "@/features/desk/application/dto";

export async function createMyDeskAction(profileId: string): Promise<ActionResult<CreateDeskResult>> {
    try {
        const useCase = makeCreateMyDeskUseCase();
        return await useCase.execute(profileId);
    } catch (error) {
        return { success: false as const, error: normalizeError(error) };
    }
}