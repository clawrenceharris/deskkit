import { createDeskSchema, createNotebookSchema, updateDeskSchema, updateNotebookSchema } from "@/lib/validation";
import z from "zod";

export type CreateDeskFormValues = z.infer<typeof createDeskSchema>;
export type CreateNotebookFormValues = z.infer<typeof createNotebookSchema>;
export type UpdateNotebookFormValues = z.infer<typeof updateNotebookSchema>;
export type UpdateDeskFormValues = z.infer<typeof updateDeskSchema>;
