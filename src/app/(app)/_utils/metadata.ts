import { getDeskAction } from "@/actions/desk/queries/getDeskAction";

/** Page metadata helper for desk-scoped routes (extend for notebook titles when needed). */
export async function getCurrentDeskOrNotebookTitle(deskId: string) {
  const currentDesk = await getDeskAction(deskId);
  if (!currentDesk.success) {
    return {
      title: "deskkit",
      description: "Share and manage your study materials in one shared desk space.",
    };
  }
  const deskTitle = `${currentDesk.data?.name ?? "Desk"}`;

  return {
    title: deskTitle,
    description: "Share and manage your study materials in one shared desk space.",
  };
}