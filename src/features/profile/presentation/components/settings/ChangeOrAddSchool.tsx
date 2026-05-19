import { Profile } from "@/features/profile/infrastructure/queries";
import { useUpdateProfileForm } from "../../hooks";
import { UpdateSchoolsForm } from "../forms";


type ChangeOrAddSchoolProps = {
    profile: Profile;
    onSuccess?: () => void;
}
export function ChangeOrAddSchool({profile, onSuccess, }: ChangeOrAddSchoolProps){

    const { form, updateProfile, isLoading } = useUpdateProfileForm({profile, onSuccess});
    const { control } = form;
   
    return (
        <div className="flex h-full min-h-0 flex-col">
       
        <div className="min-h-0 mt-5 overflow-y-auto px-4 pb-4">
          <UpdateSchoolsForm
            isLoading={isLoading} 
            control={control} 
            form={form} 
            onSubmit={updateProfile} 
            submitText="Save"
           />
        </div>
      </div>
    )
}