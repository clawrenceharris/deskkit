import { Notebook } from "../../infrastructure/queries";

export class NotebookPolicy {
    constructor(private readonly notebook: Notebook) {}
   
   canPreview(): boolean {
    return this.notebook.isLocked === false;
   }
   
   canView(): boolean {
    return this.notebook.isLocked === false;
   }
  
  
   canDelete(): boolean {
    return this.notebook.isLocked === false;
   }
   
   canDownload(): boolean {
    return this.notebook.isLocked === false;
   }
   
   canUpdate(): boolean {
    return this.notebook.isLocked === false;
   }
}