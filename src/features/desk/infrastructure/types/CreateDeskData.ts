import { DeskVisibility } from "../../domain/value-objects";

    export type CreateDeskData = {
    name: string;
    schoolId: string;
    visibility: DeskVisibility;
    creatorId: string;
    imageUrl: string | null;
    imagePath: string | null;
    description: string | null;
}