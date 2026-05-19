import { UpdateNotebookFormValues } from "@/types";

export type UpdateNotebookInput = {
    notebookId: string; 
    removeMaterialIds?: string[];
    keepMaterialIds?: string[];
    } &  UpdateNotebookFormValues
