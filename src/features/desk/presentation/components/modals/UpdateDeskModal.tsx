import { DialogContent } from "@/components/ui/dialog";
import { UpdateDeskForm } from "../forms";
import { UpdateDeskModalProps } from "@/lib/modals/types";

export function UpdateDeskModal({deskId, userId, onSuccess, onError, onCancel}: UpdateDeskModalProps) {
    return (
        <DialogContent title="Edit Desk">
            <UpdateDeskForm 
                deskId={deskId} 
                userId={userId} 
                onSuccess={onSuccess} 
                onError={onError} 
                onCancel={onCancel} 
            />
        </DialogContent>
    )
}