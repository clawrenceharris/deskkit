import { Form, InputField } from "@/components/form";
import { UpdateDeskFormValues } from "@/types";
import {  useMyDesk, useUpdateDeskForm } from "../../hooks";
import { useUserSchools } from "@/features/school/presentation/hooks";
import { SearchSelect } from "@/components/shared";
import { RadioGroup, RadioGroupItem } from "@/components/ui";
import { UpdateDeskModalProps } from "@/lib/modals/types";



export function UpdateDeskForm({deskId, userId, onSuccess, onError, onCancel}: UpdateDeskModalProps) {

    const {form, updateDesk, isLoading} = useUpdateDeskForm({deskId, onSuccess, onError});
    const { data: myDesk } = useMyDesk(userId); 
    const {data: schools = [], isLoading: isLoadingSchools} = useUserSchools(userId); 
    
    return (
      <Form<UpdateDeskFormValues>
        form={form}
        onCancel={onCancel}
        isLoading={isLoading}
        onSubmit={updateDesk}
        enableBeforeUnloadProtection
      >
      
          <InputField<UpdateDeskFormValues, "name">
            name="name"
            label="Name"
            placeholder="Enter the name of the desk"
            required
          />
          
          <InputField<UpdateDeskFormValues, "schoolId">
          name="schoolId"
          label="School"
          placeholder="Select a school"
          required
          disabled={myDesk?.id === deskId}
          renderInput={({field}) => (
  
              <SearchSelect
                items={schools.map((school) => ({
                  value: school.id,
                  label: school.name,
                }))}
                isLoading={isLoadingSchools}
                disabled={myDesk?.id === deskId}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a school"
                searchPlaceholder="Find a school"
                newItemLabel="Add school"
              />
          )}
          
          />
         
          <InputField<UpdateDeskFormValues, "visibility">
            name="visibility"
            label="Privacy"
            required={false}
            renderInput={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <RadioGroupItem value="PUBLIC">Public</RadioGroupItem>
                <RadioGroupItem value="PRIVATE">Private</RadioGroupItem>
                <RadioGroupItem value="SCHOOL">School</RadioGroupItem>
                <RadioGroupItem value="RESTRICTED">Restricted</RadioGroupItem>
              </RadioGroup>
            )}
          />
      </Form>
    );
}