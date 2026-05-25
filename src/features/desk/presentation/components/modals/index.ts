import { ModalType } from "@/lib/modals/types";
import { modalRegistry } from "@/lib/modals";
import { CreateDeskModal } from "./CreateDeskModal";
import { UpdateDeskModal } from "./UpdateDeskModal";

export * from "./CreateDeskModal";
export * from "./UpdateDeskModal";

export const DESK_MODAL_TYPES = {
  CREATE: "desk:create",
  UPDATE: "desk:update",
} as const satisfies Record<string, ModalType>;



export function registerDeskModals() {
  modalRegistry.register(DESK_MODAL_TYPES.CREATE, CreateDeskModal);
  modalRegistry.register(DESK_MODAL_TYPES.UPDATE, UpdateDeskModal);
}
