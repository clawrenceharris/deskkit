import { Form, InputField } from "@/components/form";
import { UpdateDeskFormValues } from "@/types";
import {  useMyDesk, useUpdateDeskForm } from "../../hooks";
import { useUserSchools } from "@/features/school/presentation/hooks";
import { SearchSelect } from "@/components/shared";
import { Switch } from "@/components/ui";
import { UpdateDeskModalProps } from "@/lib/modals/types";



export function UpdateDeskForm({deskId, userId, onSuccess, onError, onCancel}: UpdateDeskModalProps) {

    const {form, updateDesk, isLoading} = useUpdateDeskForm({deskId, onSuccess, onError});
    const {control, getValues, setValue} = form;
    const { data: myDesk } = useMyDesk(userId); 
    const {data: schools = [], isLoading: isLoadingSchools} = useUserSchools(userId); 
    const handleSchoolChange = (value: string) => {
      if(value.startsWith("__new__:")) {
        const newSchoolName = value.split("__new__:")[1];
        console.log(newSchoolName);
      } else {
        setValue("schoolId", value);
      }
    }
    return (
      <Form<UpdateDeskFormValues>
        form={form}
        onCancel={onCancel}
        isLoading={isLoading}
        onSubmit={updateDesk}
        enableBeforeUnloadProtection
      >
      
          <InputField
            name="name"
            control={control}
            label="Name"
            placeholder="Enter the name of the desk"
            required
          />
          
          <InputField 
          
          name="schoolId"
          control={control}
          label="School"
          placeholder="Select a school"
          required
          disabled={myDesk?.id === deskId}
          renderInput={() => (
  
              <SearchSelect
                items={schools.map((school) => ({
                  value: school.id,
                  label: school.name,
                }))}
                isLoading={isLoadingSchools}
                disabled={myDesk?.id === deskId}
                value={form.getValues("schoolId")}
                onChange={handleSchoolChange}
                placeholder="Select a school"
                searchPlaceholder="Find a school"
                newItemLabel="Add school"
              />
          )}
          
          />
         
          <InputField<UpdateDeskFormValues>
            name="isPublic"
            control={control}
            label="Privacy"
            required={false}
            renderInput={({ field }) => (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Public</span>
                <Switch
                  size="lg"
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                  id="isPublic-switch"
                  name="isPublic"
                />
              </div>
              )}
            />
      </Form>
    );
}