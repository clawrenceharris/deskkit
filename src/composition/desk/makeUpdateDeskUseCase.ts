import { PrismaDeskRepository } from "@/features/desk/infrastructure/repositories";
import { supabase } from "@/lib/supabase/client";
import { prisma } from "@/lib/db/prisma";
import { SupabaseDeskStorage } from "@/features/desk/infrastructure/storage";
import { UpdateDeskUseCase } from "@/features/desk/application/use-cases";

export async function makeUpdateDeskUseCase(): Promise<UpdateDeskUseCase> {
    const repository = new PrismaDeskRepository(prisma);
    const storage = new SupabaseDeskStorage(supabase);
    return new UpdateDeskUseCase(repository, storage);
}