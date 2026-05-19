"use client";
import { DialogContent } from "@/components/ui/dialog";
import { CreateNotebookModalProps } from "@/lib/modals/types";
import { CreateNotebookForm } from "../forms";

export function CreateNotebookModal({
  deskId, 
  onSuccess, 
  onError, 
  onCancel,
}: CreateNotebookModalProps) {
 
  return (
    <DialogContent 
      title="New Notebook" 
      className="overflow-hidden"
      description="Create a new notebook to add to this desk!">
      <CreateNotebookForm 
        deskId={deskId}
        onSuccess={onSuccess}
        onError={onError}
        onCancel={onCancel}
      />
    </DialogContent>
  );
}