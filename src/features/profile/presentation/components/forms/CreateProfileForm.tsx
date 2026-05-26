"use client";
import { Form, InputField } from "@/components/form"; 
import { FieldGroup} from "@/components/ui";
import { CreateProfileFormValues } from "@/types/profile";

import { useCreateProfileForm } from "../../hooks";
import { SearchSelect } from "@/components/shared";
import { useSchools } from "@/features/school/presentation/hooks";
import { CreateProfileResult } from "../../../application/dto";
import { ProfileAvatarField } from "./ProfileAvatarField";

type CreateProfileFormProps = {
  onSuccess?: (result: CreateProfileResult) => void;
  userId: string;
};


export function CreateProfileForm({
  onSuccess,
  userId,
}: CreateProfileFormProps) {
  const { form, isLoading, createProfile } = useCreateProfileForm({userId, onSuccess });
  const { control, getValues } = form;
  const { data: schools = [] } = useSchools();
  
  return (
    <Form<CreateProfileFormValues>
        isLoading={isLoading}
        form={form}
        isDialog
        showsCancelButton={false}
        onCancel={() => createProfile(getValues())}
        onSubmit={createProfile}>
      <ProfileAvatarField<CreateProfileFormValues, "avatarFile"> profile={null} name="avatarFile" control={control} />
      <FieldGroup>  
        <InputField<CreateProfileFormValues, "schoolId">
          name="schoolId"
          label="School"
          placeholder="Select a school"
          renderInput={({field}) => (
            <SearchSelect
              items={schools.map((school) => ({
                value: school.id,
                label: school.name,
              }))}
              
              placeholder="Select a school"
              searchPlaceholder="Find a school"
              newItemLabel="Add school"
              {...field}
            />
          )}
        />
        <InputField<CreateProfileFormValues, "displayName">
          showsLabel={false}
          placeholder="Display name"
          name="displayName"
          required={false}
          label="Display name"
        />
        <InputField<CreateProfileFormValues, "username">
          showsLabel={false}
          placeholder="Username"
          name="username"
          required
          label="Username"
        />
      </FieldGroup>
    </Form>
  );
}
