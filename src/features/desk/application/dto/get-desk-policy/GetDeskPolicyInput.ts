export type GetDeskPolicyInput = {
    userId: string | null;
    deskId: string | null;
    resourceId?: string | null;
    deskType?: "school" | "my" | null;
    resourceType?: "notebook" | "question" | "chalkboard" | null;
}