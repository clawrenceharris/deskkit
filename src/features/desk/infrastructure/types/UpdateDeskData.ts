export type UpdateDeskData = {
    name?: string;
    schoolId?: string;
    isPublic?: boolean;
    imageUrl?: string | null;
    deskId: string;
    imagePath?: string | null;
    description?: string | null;
}