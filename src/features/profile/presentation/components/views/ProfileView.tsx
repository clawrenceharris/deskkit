import { ProfileTab, SettingsAction } from "@/types";
import { ProfileNotebooksView } from ".";
import { ProfileSettingsStack } from "../settings";
import { MinimalDeskListItem } from "@/features/desk/presentation/components/ui/MinimalDeskListItem";
import { AtSign, GraduationCap, Pencil } from "lucide-react";
import { Button } from "@/components/ui";
import { ProfileHeader, ProfileNavbar } from "../ui";
import { useState } from "react";
import { useAuth, useProfileContext } from "@/app/providers";
import { useNotebooksByUserId } from "@/features/notebook/presentation/hooks";
import { useModals } from "@/hooks/useModals";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { useUserSettings } from "../../providers";
import { EmptyState } from "@/components/states";

type ProfileViewProps = {
  profile: ProfileForDetail;
}
export function ProfileView({ profile }: ProfileViewProps){
  const {data: notebooks = []} = useNotebooksByUserId(profile.userId);
  const { modals: { "confirmation": confirmationModal }} = useModals();
  
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.PROFILE);
  const { isCurrentUser } = useProfileContext();
  function handleEditUsernameClick() {
    setActiveTab(ProfileTab.SETTINGS);
    settings.push("edit-profile");
  }
  const settings = useUserSettings();

  function handleAction(action: SettingsAction) {
    switch(action){
      case "sign-out": {
        confirmationModal.open({
          title: "Sign Out", 
          description: "Are you sure you want to sign out?", 
          onConfirm: () => {
          signOut();
        }});
      }
    }
  }
  const handleTabClick = (tab: ProfileTab) => {
    setActiveTab(tab);
    if (tab !== ProfileTab.SETTINGS) {
      settings.pop();
    }
  };
  function handleEditSchoolClick() {
    setActiveTab(ProfileTab.SETTINGS);
    settings.push("manage-school");
  }

 
    return (
        <>
          <ProfileNavbar className="my-4" onTabClick={handleTabClick} currentTab={activeTab} profile={profile}/>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

          {activeTab === ProfileTab.PROFILE && (
            <div className="flex flex-col min-h-0 flex-1 px-5 py-3">
              
              <ProfileHeader
               onEditUsernameClick={handleEditUsernameClick}
               profile={profile} />
              <div className="flex flex-col gap-3 mt-4">
              
                
                    {profile.school ? (
                      <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                       <GraduationCap className="size-5" />
                       {profile.school.name}
                       { isCurrentUser && <Button
                          onClick={handleEditSchoolClick}
                          size="icon-sm"
                          variant="ghost"
                          className="text-muted-foreground"
                        >
                          <Pencil className="size-3" strokeWidth={3} />
                        </Button> }
                      </span>
                    ) : null}
              </div>
            </div>    
          )}
          
     
          {activeTab === ProfileTab.DESKS && ( 
            <div className="flex min-h-0 flex-1 flex-col px-5">
              <h3 className="mb-3 text-lg font-bold">Desks</h3>
              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pb-4">
                {profile.memberships.length <= 0 ? profile.memberships.map((m) => (
                    <MinimalDeskListItem desk={m.desk} key={m.desk.id}/>
                  )) : (
                    <div className="flex flex-col gap-2">
                      <EmptyState
                        itemVariant="outline"
                        message={isCurrentUser ? "You are not a member of any desks" : `${profile.displayName ?? profile.username} is not a member of any desks`}
                        variant="item"  
                     
                      />
                    </div>
                  )
                }
              </div>
            </div>
          )}
          {activeTab === ProfileTab.NOTEBOOKS && (
            <div className="flex min-h-0 flex-1 flex-col px-5">
              <h3 className="mb-3 text-lg font-bold">Notebooks</h3>
              <ProfileNotebooksView profile={profile} notebooks={notebooks}/>
            </div>
          )}
          {activeTab === ProfileTab.SETTINGS && (

             
                <ProfileSettingsStack
                  profile={profile}
                  onNavigate={settings.push}
                  onBack={settings.pop}
                  onAction={handleAction}
                />
              
          )}
        </div>
        </>
    )
}