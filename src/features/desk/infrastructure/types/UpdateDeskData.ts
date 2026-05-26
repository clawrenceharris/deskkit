import { DeskVisibility } from "../../domain/value-objects";

export type UpdateDeskData = {
    name?: string;
    schoolId?: string;
    visibility?: DeskVisibility;
    imageUrl?: string | null;
    deskId: string;
    imagePath?: string | null;
    description?: string | null;
}