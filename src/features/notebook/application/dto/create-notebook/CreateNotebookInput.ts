import { CreateNotebookFormValues } from "@/types";

export type CreateNotebookInput = {
    deskId: string;
    userId: string;
  } & CreateNotebookFormValues;