import { Form, FormProps, InputField } from "@/components/form";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { UpdateProfileFormValues } from "@/types/profile";
import { useSchools } from "@/features/school/presentation/hooks";
import { Control, useController } from "react-hook-form";
type UpdateSchoolsFormProps = FormProps<UpdateProfileFormValues> & {
  control: Control<UpdateProfileFormValues>
};


export function UpdateSchoolsForm({control, form, ...formProps}: UpdateSchoolsFormProps) {
    const {data: schools = [], isLoading: isLoadingSchools} = useSchools();
    const {field} = useController({
      control: control,
      name: "schoolId",
    });
    return (
    <Form<UpdateProfileFormValues> 
      form={form}
      {...formProps}
    >

        <InputField
          name="schoolId"
          control={control}
          label="My School"
          placeholder="Select a school"
          renderInput={() => (
            <SearchSelect
              items={schools.map((school) => ({
                value: school.id,
                label: school.name,
              }))}
              value={field.value}
              isLoading={isLoadingSchools}
              onChange={field.onChange}
              placeholder="Select a school"
              searchPlaceholder="Find a school"
              newItemLabel="Add school"

            />
          )}
        />  
    </Form>
  );
}