import { ApplicationError } from "@/shared/utils/errors";
import { DeskRepository } from "../../domain/repositories";
import { fail, ok } from "@/shared/application";
import { Result } from "@/shared/application";
import { DeleteDeskResult } from "../dto";
import { AppErrorCode } from "@/types/errors";

type DeleteDeskUseCaseResult = Result<DeleteDeskResult, ApplicationError>;
export class DeleteDeskUseCase {
    constructor(private readonly deskRepository: DeskRepository) {}
    async execute(deskId: string): Promise<DeleteDeskUseCaseResult> {
        try {
            const desk = await this.deskRepository.query.getDesk(deskId);
            if (!desk) {
                return fail(new ApplicationError({code: AppErrorCode.RESOURCE_NOT_FOUND, message: "Desk not found"}));
            }
            const deletedDesk = await this.deskRepository.deleteDesk(deskId);
            return ok({
                deskId: deletedDesk.id,
                name: deletedDesk.name,
            });
        }
        catch (error) {
            console.error("Error deleting desk", error);
            return fail(ApplicationError.unexpected(error));
        }
    }
}               