"use client";
import type { Profile } from "@/features/profile/infrastructure/queries";
import { UpdateProfileForm } from "../forms";
import { useUpdateProfileForm } from "../../hooks";
import { UpdateProfileResult } from "@/features/profile/application/dto";

type ProfileSettingsEditPanelProps = {
  profile: Profile;
  onSuccess: (result: UpdateProfileResult) => void;
};

export function ProfileSettingsEditPanel({
  profile,
  onSuccess,
}: ProfileSettingsEditPanelProps) {
  const { form, isLoading, updateProfile } = useUpdateProfileForm({profile, onSuccess });
  
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <UpdateProfileForm isLoading={isLoading} form={form} onSubmit={updateProfile} submitText="Save" />
      </div>
    </div>
  );
}
