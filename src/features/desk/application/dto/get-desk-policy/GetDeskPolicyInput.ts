export type GetDeskPolicyInput = {
    userId: string | null;
    deskId: string | null;
    resourceId?: string | null;
    deskType?: "school" | "my" | null;
    schoolId: string | null;
    resourceType?: "notebook" | "question" | "chalkboard" | null;
}