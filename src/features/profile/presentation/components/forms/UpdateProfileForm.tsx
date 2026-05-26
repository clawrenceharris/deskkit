"use client";

import { Form, FormProps, InputField } from "@/components/form";
import { FieldGroup } from "@/components/ui";
import { UpdateProfileFormValues } from "@/types/profile";

export function UpdateProfileForm(props: FormProps<UpdateProfileFormValues>) {
  return (
    <Form<UpdateProfileFormValues>
        showsCancelButton={false}
        {...props}
        >
       
      <FieldGroup>
        <InputField<UpdateProfileFormValues, "displayName">
          placeholder="Display name"
          name="displayName"
          required={false}
          label="Display name"
        />
        <InputField<UpdateProfileFormValues, "username">
          placeholder="Username"
          name="username"
          required
          label="Username"
        />
      </FieldGroup>
    </Form>
  );
}
