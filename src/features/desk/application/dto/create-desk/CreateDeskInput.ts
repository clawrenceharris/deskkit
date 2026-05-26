import { DeskVisibility } from "@/features/desk/domain/value-objects";

export type CreateDeskInput = {
    name: string;
    schoolId: string;
    visibility: DeskVisibility;
    creatorId: string;
    imageFile?: File | null;
    description?: string;
}