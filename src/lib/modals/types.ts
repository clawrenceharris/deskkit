import { CreateProfileResult, UpdateProfileResult } from "@/features/profile/application/dto";
import { CreateDeskResult, DeleteDeskResult, UpdateDeskResult } from "@/features/desk/application/dto";
import { CreateNotebookResult, UpdateNotebookResult } from "@/features/notebook/application/dto";
  
/**
 * Base interface for all modal props
 */
export interface ModalProps {
  [key: string]: unknown;
  onError?: (error: string) => void;
  onCancel?: () => void;
  isAlert?: boolean;
}

/**
 * Union type of all modal type strings
 */
export type ModalType =
  | "profile:create"
  | "profile:view"
  | "profile:delete"
  | "profile:update"
  | "desk:create"
  | "desk:update"
  | "desk:delete"
  | "notebook:create"
  | "notebook:update"
  | "notebook:delete"
  | "confirmation"
/**
 * State interface for ModalProvider
 */
export interface ModalState {
  type: ModalType | null;
  props: ModalProps | null;
}

// ============================================================================
// Profile Modal Props
// ============================================================================

export interface CreateProfileModalProps extends ModalProps {
  onSuccess?: (result: CreateProfileResult) => void;
  userId: string;
}

export interface UpdateProfileModalProps extends ModalProps {
  userId: string;
  onSuccess?: (result: UpdateProfileResult) => void;
}

export interface ViewProfileModalProps extends ModalProps {
  userId: string;
}

// ============================================================================
// Desk Modal Props
// ============================================================================

export interface CreateDeskModalProps extends ModalProps {
  userId: string;
  onSuccess?: (result: CreateDeskResult) => void;
  
}
export interface UpdateDeskModalProps extends ModalProps {
  deskId: string;
  userId: string;
  onSuccess?: (result: UpdateDeskResult) => void;
}

export interface DeleteDeskModalProps extends ModalProps {
  deskName: string;
  onSuccess?: (result: DeleteDeskResult) => void;
}

// ============================================================================
// Notebook Modal Props
// ============================================================================

export interface CreateNotebookModalProps extends ModalProps {
  deskId: string;
  onSuccess?: (result: CreateNotebookResult) => void;
  
}

export interface UpdateNotebookModalProps extends ModalProps {
  notebookId: string;
  deskId: string;
  onSuccess?: (result: UpdateNotebookResult) => void;
}


export interface ConfirmationModalProps extends ModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
}