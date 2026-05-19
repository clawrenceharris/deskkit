export type CreateSchoolInput = {
    name: string;
    students: {
        userId: string;
    }[];
    desks: {
        id: string;
    }[];
}