import { Form, FormProps, InputField } from "@/components/form";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { UpdateProfileFormValues } from "@/types/profile";
import { useSchools } from "@/features/school/presentation/hooks";



export function UpdateSchoolsForm(props: FormProps<UpdateProfileFormValues>) {
    const {data: schools = [], isLoading: isLoadingSchools} = useSchools();
    return (
    <Form<UpdateProfileFormValues> 
      {...props}
    >

        <InputField<UpdateProfileFormValues, "schoolId">
          name="schoolId"
          label="My School"
          placeholder="Select a school"
          renderInput={({field}) => (
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