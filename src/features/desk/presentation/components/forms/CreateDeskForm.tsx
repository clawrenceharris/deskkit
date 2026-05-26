"use client";
import { Form, InputField } from "@/components/form";
import { CreateDeskFormValues } from "@/types";
import { useCreateDeskForm } from "../../hooks";
import {SearchSelect} from "@/components/shared";
import { useSchools } from "@/features/school/presentation/hooks";
import { CreateDeskModalProps } from "@/lib/modals/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui";



export function CreateDeskForm({userId,onCancel, onSuccess, onError}: CreateDeskModalProps) {
  const {form, createDesk, isLoading} = useCreateDeskForm({userId, onSuccess, onError});
  const {data: schools = [], isLoading: isLoadingSchools} = useSchools();  
  
  
  return (
    <Form<CreateDeskFormValues>
      form={form}
      onCancel={onCancel}
      isLoading={isLoading}
      onSubmit={createDesk}
      enableBeforeUnloadProtection
    >
    
        <InputField<CreateDeskFormValues, "name">
          name="name"
          label="Name"
          placeholder="Enter the name of the desk"
          required
        />
        
        <InputField<CreateDeskFormValues, "schoolId">
        
          name="schoolId"
          label="School"
          placeholder="Select a school"
          required
          renderInput={({field}) => (

            <SearchSelect
              items={schools.map((school) => ({
                value: school.id,
                label: school.name,
              }))}
              disabled={isLoadingSchools}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select a school"
              searchPlaceholder="Find a school"
              newItemLabel="Add school"
            />
          )}
        
        />
       
        <InputField<CreateDeskFormValues, "visibility">
          name="visibility"
          label="Privacy"
          required={false}
          renderInput={({ field }) => (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Public</span>
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <RadioGroupItem value="PUBLIC">Public</RadioGroupItem>
                <RadioGroupItem value="PRIVATE">Private</RadioGroupItem>
                <RadioGroupItem value="SCHOOL">School</RadioGroupItem>
                <RadioGroupItem value="RESTRICTED">Restricted</RadioGroupItem>
              </RadioGroup>
            </div>
            )}
          />
    </Form>
  );
}