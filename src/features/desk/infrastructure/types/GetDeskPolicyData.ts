export type GetDeskPolicyData = {
    deskId: string;
    userId: string;
    resourceId: string | null;
    deskType: "school" | "my" | null;
    schoolId: string;
    resourceType: "notebook" | "question" | "chalkboard" | null;
}