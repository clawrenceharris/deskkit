export type UpdateSchoolInput = {
    id: string;
    name?: string;
    students?: {
        userId: string;
    }[];
    desks?: {
        id: string;
    }[];
}