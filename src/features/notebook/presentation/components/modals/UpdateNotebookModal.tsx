import { DialogContent } from "@/components/ui/dialog";
import { UpdateNotebookForm } from "../forms";
import {  UpdateNotebookModalProps } from "@/lib/modals/types";

export function UpdateNotebookModal({
  notebookId, 
  deskId, 
  onSuccess, 
  onError, 
  onCancel
}: UpdateNotebookModalProps) {

    return (
    <DialogContent
      title="Edit Notebook"
      description="Your Notebook is a collection of materials that you and your friends can use to study."
    >
      <UpdateNotebookForm 
        notebookId={notebookId} 
        deskId={deskId}
        onSuccess={onSuccess}
        onError={onError}
        onCancel={onCancel}
      />
    </DialogContent>
  );
}