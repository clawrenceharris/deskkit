"use client";

import { Form, FormProps, InputField } from "@/components/form";
import { FieldGroup } from "@/components/ui";
import { UpdateProfileFormValues } from "@/types/profile";
import { Control } from "react-hook-form";

type UpdateProfileFormProps = FormProps<UpdateProfileFormValues> & {
  control: Control<UpdateProfileFormValues>
};


export function UpdateProfileForm({
  control,
  ...formProps

}: UpdateProfileFormProps) {
  return (
    <Form<UpdateProfileFormValues>
        showsCancelButton={false}

        {...formProps}
        >
       
      <FieldGroup>
        <InputField
          placeholder="Display name"
          name="displayName"
          required={false}
          label="Display name"
          control={control}
        />
        <InputField
          placeholder="Username"
          name="username"
          required
          label="Username"
          control={control}
        />
      </FieldGroup>
    </Form>
  );
}
